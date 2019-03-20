import * as functions from 'firebase-functions'
import * as puppeteer from 'puppeteer'
const { PubSub } = require('@google-cloud/pubsub')
const pubsub = new PubSub('akuu-37e4b')

const launchOptions = {
  args: ['--no-sandbox']
}

const TOPIC_SCRAPING_FORTUNE = 'ScrapingFortune'

export const startScraping = functions
  .region('asia-northeast1')
  .https.onRequest((request, response) => {
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

    const message = { userID, email, password }
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
    console.log('message' + message.data)
    console.log('message' + message.json)
    console.log('message' + message.toJSON())
    const browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()
    console.log(page.url())
  })
