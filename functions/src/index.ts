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
  .https.onRequest(async (request, response) => {
    if (request.method !== 'POST') {
      response.status(405).send()
      return
    }
    const userID: string = request.body.userID
    const email: string = request.body.email
    const password: string = request.body.password
    if (!userID || !email || !password) {
      response.status(400).send()
      return
    }

    const message: ScrapingFortuneMessage = { userID, email, password }

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
    response.status(200).send({ status: 'OK' })
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
        .doc(messageData.userID)
        .set({ fortuneAggregateData: results }, { merge: true })
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      await page.close()
    }
  })
