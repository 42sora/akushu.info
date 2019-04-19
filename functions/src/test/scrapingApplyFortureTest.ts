import * as puppeteer from 'puppeteer'
import * as fortune from '../scraping/fortune'

const email = process.env.EMAIL!;
const password = process.env.PASSWORD!;

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

// tslint:disable-next-line: no-floating-promises
(async () => {
  const page = await getNewPage()
  const { isSuccess, errorMessage } = await fortune.login(page, email, password)
  console.info(JSON.stringify(isSuccess, undefined, 1))
  console.info(JSON.stringify(errorMessage, undefined, 1))
  const applyList = await fortune.getApplyList(page)
  console.info(JSON.stringify(applyList, undefined, 1))
  for (const apply of applyList) {
    if (apply.isLotteryCompleted) {
      apply.details = await fortune.getApplyDetailAfterLottery(page, apply.detailURL)
    } else {
      apply.details = await fortune.getApplyDetailBeforeLottery(page, apply.detailURL)
    }
  }
  console.info(JSON.stringify(applyList, undefined, 1))

})()
