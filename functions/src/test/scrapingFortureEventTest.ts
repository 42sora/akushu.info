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
  console.log(isSuccess + ":" + errorMessage);
  const url = await fortune.getGoodsPageUrl(page, 'https://fortunemusic.jp/yoshimotozaka_201905/')
  console.log(url);
  if (url !== null) {
    const res = await fortune.getGoodsList(page, url)
    console.log(res);
    console.log(JSON.stringify(res, undefined, 1));
  }


})()
