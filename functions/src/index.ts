import * as functions from 'firebase-functions'
import * as puppeteer from 'puppeteer'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB'
  })
  .https.onRequest(async (request, response) => {
    const launchOptions = {
      args: ['--no-sandbox']
    }

    const browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()

    response.send('Hello from Firebase!' + page.url())
  })
