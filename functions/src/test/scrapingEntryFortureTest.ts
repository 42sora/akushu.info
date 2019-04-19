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
  const entryList = await fortune.getEntryList(page)
  console.info(JSON.stringify(entryList, undefined, 1))
  for (const entry of entryList) {
    entry.details = await fortune.getEntryDetail(page, entry.detailURL)
  }
  console.info(JSON.stringify(entryList, undefined, 1))


})()
