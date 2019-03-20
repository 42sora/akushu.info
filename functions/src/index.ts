import * as functions from 'firebase-functions'
import * as puppeteer from 'puppeteer'
import * as fortune from './scraping/fortune'
const { PubSub } = require('@google-cloud/pubsub')
const pubsub = new PubSub('akuu-37e4b')

const TOPIC_SCRAPING_FORTUNE = 'ScrapingFortune'

const launchOptions = {
  args: ['--no-sandbox']
}

let browser: puppeteer.Browser

export const startScraping = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response) => {
    if (request.method !== 'POST') {
      response.status(405).send()
      return
    }
    const userID = request.body.userID
    const email = request.body.email
    const password = request.body.password
    if (!userID || !email || !password) {
      response.status(400).send()
      return
    }

    const message: ScrapingFortuneMessage = { userID, email, password }
    console.log(message)

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
    response.send('Hello from Firebase!')
  })

export const pubFortune = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB'
  })
  .pubsub.topic(TOPIC_SCRAPING_FORTUNE)
  .onPublish(async (message, context) => {
    const messageData: ScrapingFortuneMessage = message.json

    if (!browser) {
      browser = await puppeteer.launch(launchOptions)
    }
    const page = await browser.newPage()
    try {
      await fortune.getFortune(page, messageData)
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      await page.close()
    }
  })
