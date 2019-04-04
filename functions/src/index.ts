import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as puppeteer from 'puppeteer'
import * as fortune from './scraping/fortune'
import * as aggregator from './aggregator/fortuneAggregator'
import Waiter from './utils/waiter'

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

    const queue = await db.collection('queue').add({
      uid: auth.uid,
      state: 'WAITING',
      reason: ''
    })

    const message: ScrapingFortuneMessage = {
      queueId: queue.id,
      uid: auth.uid,
      email: email,
      password: password
    }

    const dataBuffer = Buffer.from(JSON.stringify(message))
    const messageId = await pubsub
      .topic(TOPIC_SCRAPING_FORTUNE)
      .publish(dataBuffer)
    console.debug(`Message ${messageId} published.`)

    return { status: 'OK', queueId: queue.id }
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

    const waiter = new Waiter()

    const queue = db.collection('queue').doc(messageData.queueId)
    const unsubscribe = queue.onSnapshot(async snapshot => {
      if (snapshot.get('state') && snapshot.get('state') === 'READY') {
        const page = await getNewPage()
        try {
          const details = await fortune.getFortune(page, messageData)
          console.debug(JSON.stringify(details, undefined, 1))
          const results = aggregator.aggregate(details)
          console.debug(JSON.stringify(results, undefined, 1))

          await db
            .collection('users')
            .doc(messageData.uid)
            .set({ fortuneAggregateData: results }, { merge: true })
          await snapshot.ref.update({ state: 'COMPLETE' })
        } catch (e) {
          console.error(e)
          await snapshot.ref.update({ state: 'FAILED', reason: e })
          throw e
        } finally {
          unsubscribe()
          await page.close()
          waiter.notify()
        }
      }
    })

    await waiter.wait()
  })
