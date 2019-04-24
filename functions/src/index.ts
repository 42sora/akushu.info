import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as puppeteer from 'puppeteer'
import * as fortune from './scraping/fortune'

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
    await db
      .collection('users')
      .doc(auth.uid)
      .set({
        scrapingState: {
          state: 'WAITING',
          errorMessage: '',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
      }, { merge: true }
      )

    return { status: 'OK' }
  })

export const subFortune = functions
  .region(REGION)
  .runWith({
    timeoutSeconds: 540,
    memory: '1GB'
  })
  .pubsub.topic(TOPIC_SCRAPING_FORTUNE)
  .onPublish(async (message, _) => {

    const messageData: ScrapingFortuneMessage = message.json
    const userStore = db
      .collection('users')
      .doc(messageData.uid)

    const setState = async (state: State, errorMessage = '') =>
      userStore.set({
        scrapingState: {
          state: state,
          errorMessage: errorMessage,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
      }, { merge: true }
      )

    // tslint:disable-next-line: no-floating-promises
    setState('EXECUTING')

    // 前回登録したものを取得
    const userDoc = await userStore.get()
    const previousEntryList: Entry[] = userDoc.get('fortune.entryList') || []
    const previousApplyList: Aplly[] = userDoc.get('fortune.applyList') || []

    const page = await getNewPage()
    try {
      const { isSuccess, errorMessage } = await fortune.login(page, messageData.email, messageData.password)
      if (!isSuccess) {
        console.error(errorMessage)
        await setState('LOGIN_FAILED', errorMessage)
        return
      }

      const currentEntryList = await fortune.getEntryList(page)
      const newEntries = currentEntryList
        .filter(c => previousEntryList.every(p => p.entryNumber !== c.entryNumber))
      for (const entry of newEntries) {
        entry.details = await fortune.getEntryDetail(page, entry.detailURL)
      }
      const entryList = previousEntryList.concat(newEntries)
      console.info(JSON.stringify(entryList, undefined, 1))
      const promises = [userStore.set({ fortune: { entryList } }, { merge: true })]

      const currentApplyList = await fortune.getApplyList(page)
      const newApplies = currentApplyList
        .filter(c => previousApplyList.every(p => p.applicationNumber !== c.applicationNumber))
      for (const apply of newApplies) {
        if (apply.isLotteryCompleted) {
          apply.details = await fortune.getApplyDetailAfterLottery(page, apply.detailURL)
        } else {
          apply.details = await fortune.getApplyDetailBeforeLottery(page, apply.detailURL)
        }
      }
      const updatedApplies = currentApplyList
        .filter(c => previousApplyList.some(p =>
          p.applicationNumber === c.applicationNumber &&
          p.isLotteryCompleted !== c.isLotteryCompleted))
      for (const apply of updatedApplies) {
        apply.details = await fortune.getApplyDetailAfterLottery(page, apply.detailURL)
      }

      const applyList = previousApplyList
        .filter(p => updatedApplies.every(u => u.applicationNumber !== p.applicationNumber))
        .concat(updatedApplies)
        .concat(newApplies)
      console.info(JSON.stringify(applyList, undefined, 1))
      promises.push(userStore.set({ fortune: { applyList } }, { merge: true }))

      promises.push(setState('COMPLETED'))
      await Promise.all(promises)
    } catch (e) {
      console.error(e)
      await setState('SYSTEM_ERROR', JSON.stringify(e, undefined, 1))
      throw e
    } finally {
      await page.close()
    }
  })
