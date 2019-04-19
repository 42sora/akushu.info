import { Page } from 'puppeteer'

const LOGIN_URL = 'https://fortunemusic.jp/default/login/'
const ENTRY_LIST_URL = 'https://fortunemusic.jp/mypage/entry_list/'

const logging = async (page: Page) => {
  // await page.screenshot({ path: Date.now() + ".png", fullpage: true });
  // const title = await page.title();
  // console.info(title);
  const url = await page.url()
  console.info(url)
  // const cookies = await page.cookies();
  // console.info("cookie");
  // console.info(JSON.stringify(cookies, undefined, 1));
}

export const login = async (page: Page, email: string, password: string) => {
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' })
  await logging(page)
  await page.type('input[name="login_id"]', email)
  await page.type('input[name="login_pw"]', password)
  // tslint:disable-next-line: no-floating-promises
  page.evaluate(() => document.forms.login_form.submit())
  await page.waitForNavigation({
    timeout: 60000,
    waitUntil: 'domcontentloaded'
  })
  await logging(page)
  const transitionedURL = await page.url()
  if (transitionedURL === LOGIN_URL) {
    const errorMessage = await page.evaluate(() => {
      const p: P | null = document.querySelector('form > div:nth-child(1) > p:nth-child(2)')
      if (p === null) {
        return ''
      }
      return p.innerText
    })
    return { isSuccess: false, errorMessage }
  }
  return { isSuccess: true, errorMessage: '' }
}

const getEntryListData = async (page: Page) => {
  await logging(page)
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('table > tbody > tr')).map(tr => {
      const td1 = tr.querySelector('td:nth-child(1) > a') as A
      const detailPageURL = td1.href
      const entryNumber = td1.textContent!
      const entryDate = tr.querySelector('td:nth-child(2)')!.textContent!
      const totalAmount = tr.querySelector('td:nth-child(3)')!.textContent!
      const eventName = tr.querySelector('td:nth-child(4)')!.textContent!
      const details: EntryDetail[] = []

      const result: EntryListData = {
        detailPageURL,
        entryNumber,
        entryDate,
        totalAmount,
        eventName,
        details
      }
      return result
    })
  )
}

export const getEntryDetail = async (page: Page, url: string) => {
  await page.waitFor(1000)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await logging(page)
  return (await page.evaluate(() =>
    Array.from(document.querySelectorAll('table > tbody > tr'))
      .slice(0, -5) // テーブルのフッター部分を除去
      .map(tr => {
        // ex:"井口　眞緒【3/24 愛知 第５部】欅坂46 8thシングル発売記念個別握手会"
        const itemName = tr.querySelector('td:nth-child(1)')!.textContent!
        // ex:1,050円
        const unitPrice = tr.querySelector('td:nth-child(2)')!.textContent!
        // ex:"数量2個"
        const quantity = tr.querySelector('td:nth-child(3)')!.textContent!
        // ex:3,150円
        const subtotal = tr.querySelector('td:nth-child(4)')!.textContent!

        const reslut: EntryDetail = { itemName, unitPrice, quantity, subtotal }

        return reslut
      })
  ))
}


export const getEntryList = async (page: Page, url = ENTRY_LIST_URL) => {
  await page.waitFor(1000)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  const entryListData = await getEntryListData(page)
  const nextPageURL = await page.evaluate(() => {
    const a: A | null = document.querySelector('p.pageNext > a')
    if (a !== null) {
      return a.href
    }
    return null
  })

  if (nextPageURL !== null) {
    entryListData.push(...(await getEntryList(page, nextPageURL)))
  }

  return entryListData
}
