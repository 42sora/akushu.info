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
  return browser.newPage()
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
  .onPublish(async (message, context) => {
    const messageData: ScrapingFortuneMessage = message.json

    const page = await getNewPage()
    try {
      const details = await fortune.getFortune(page, messageData)
      console.info(JSON.stringify(details, undefined, 1))
      const results = aggregator.aggregate(details)
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
