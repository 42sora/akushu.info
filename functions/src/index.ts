import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as puppeteer from 'puppeteer'
import * as fortune from './scraping/fortune'
import * as aggregator from './aggregator/fortuneAggregator'

// firestore
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

// pubsub
const { PubSub } = require('@google-cloud/pubsub')
const pubsub = new PubSub('akuu-37e4b')
const TOPIC_SCRAPING_FORTUNE = 'ScrapingFortune'

// deploy setteing
const REGION = 'asia-northeast1'

// puppeteer
let browser: puppeteer.Browser
const getNewPage = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox']
    })
  }
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on('request', async request => {
    if (
      ['image', 'stylesheet', 'font', 'script'].includes(request.resourceType())
    ) {
      // tslint:disable-next-line: no-floating-promises
      request.abort()
    } else {
      // tslint:disable-next-line: no-floating-promises
      request.continue()
    }
  })
  return page
}

// functions
export const startScraping = functions
  .region(REGION)
  .runWith({
    memory: '128MB'
  })
  .https.onCall(async (data, context) => {
    const auth = context.auth
    if (!auth) {
      throw new functions.https.HttpsError('permission-denied', 'faild auth')
    }
    const email: string = data.email
    const password: string = data.password
    if (!email || !password) {
      throw new functions.https.HttpsError('invalid-argument', 'bad request')
    }

    const message: ScrapingFortuneMessage = {
      uid: auth.uid,
      email: email,
      password: password
    }

    const dataBuffer = Buffer.from(JSON.stringify(message))
    pubsub
      .topic(TOPIC_SCRAPING_FORTUNE)
      .publish(dataBuffer)
      .then((messageId: any) => {
        console.log(`Message ${messageId} published.`)
      })
      .catch((err: any) => {
        console.error('ERROR:', err)
      })
    return { status: 'OK' }
  })

export const subFortune = functions
  .region(REGION)
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB'
  })
  .pubsub.topic(TOPIC_SCRAPING_FORTUNE)
  .onPublish(async (message, _) => {
    const messageData: ScrapingFortuneMessage = message.json

    const page = await getNewPage()
    try {
      const { isSuccess, errorMessage } = await fortune.login(page, messageData.email, messageData.password)
      if (!isSuccess) {
        console.error(errorMessage)
      }
      const entryList = await fortune.getEntryList(page)
      for (const entry of entryList) {
        entry.details = await fortune.getEntryDetail(page, entry.detailURL)
      }
      console.info(JSON.stringify(entryList, undefined, 1))
      const results = aggregator.aggregateEntry(entryList)
      console.info(JSON.stringify(results, undefined, 1))
      await db
        .collection('users')
        .doc(messageData.uid)
        .set({ fortuneAggregateData: results }, { merge: true })
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      await page.close()
    }
  })
