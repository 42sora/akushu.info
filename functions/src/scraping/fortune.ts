import { Page } from 'puppeteer'

const LOGIN_URL = 'https://fortunemusic.jp/default/login/'
const ENTRY_LIST_URL = 'https://fortunemusic.jp/mypage/entry_list/'
const APPLY_LIST_URL = 'https://fortunemusic.jp/mypage/apply_list/'

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
      const detailURL = td1.href
      const entryNumber = td1.textContent!
      const entryDate = tr.querySelector('td:nth-child(2)')!.textContent!
      const totalAmount = tr.querySelector('td:nth-child(3)')!.textContent!
      const eventName = tr.querySelector('td:nth-child(4)')!.textContent!
      const details: EntryDetail[] = []

      const result: Entry = {
        detailURL,
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
  const entryList = await getEntryListData(page)
  const nextPageURL = await page.evaluate(() => {
    const a: A | null = document.querySelector('p.pageNext > a')
    if (a !== null) {
      return a.href
    }
    return null
  })

  if (nextPageURL !== null) {
    entryList.push(...(await getEntryList(page, nextPageURL)))
  }

  return entryList
}

const getApplyListData = async (page: Page) => {
  await logging(page)
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('table > tbody > tr')).map(tr => {
      const td1 = tr.querySelector('td:nth-child(1) > a') as A
      const detailURL = td1.href
      const applicationNumber = td1.textContent!
      const applicationDate = tr.querySelector('td:nth-child(2)')!.textContent!
      const applicationTotalAmount = tr.querySelector('td:nth-child(3)')!.textContent!
      const eventName = tr.querySelector('td:nth-child(4)')!.textContent!
      const lotteryState = tr.querySelector('td:nth-child(5)')!.textContent!
      const lotteryResult = tr.querySelector('td:nth-child(6)')!.textContent!
      const details: ApplyDetail[] = []
      const isLotteryCompleted = lotteryState.indexOf("未抽選") === -1

      const result: Aplly = {
        detailURL,
        applicationNumber,
        applicationDate,
        applicationTotalAmount,
        eventName,
        lotteryState,
        lotteryResult,
        isLotteryCompleted,
        details
      }
      return result
    })
  )
}

export const getApplyList = async (page: Page, url = APPLY_LIST_URL) => {
  await page.waitFor(1000)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  const applyList = await getApplyListData(page)
  const nextPageURL = await page.evaluate(() => {
    const a: A | null = document.querySelector('p.pageNext > a')
    if (a !== null) {
      return a.href
    }
    return null
  })

  if (nextPageURL !== null) {
    applyList.push(...(await getApplyList(page, nextPageURL)))
  }

  return applyList
}

export const getApplyDetailBeforeLottery = async (page: Page, url: string) => {
  await page.waitFor(1000)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await logging(page)
  return (await page.evaluate(() =>
    Array.from(document.querySelectorAll('table > tbody > tr'))
      .slice(1) // ページ上部に抽選状況のテーブルがある
      .map(tr => {
        // ex:"星野みなみ【7/28 神奈川 第１部】乃木坂46 23rdシングル発売記念 個別握手会"
        const itemName = tr.querySelector('td:nth-child(1)')!.textContent!
        // ex:"1,050円"
        const unitPrice = tr.querySelector('td:nth-child(2)')!.textContent!
        // ex:"3個"
        const applicationQuantity = tr.querySelector('td:nth-child(3)')!.textContent!

        const reslut: ApplyDetail = {
          itemName,
          unitPrice,
          applicationQuantity,
          winningQuantity: '',
          subtotal: ''
        }
        return reslut
      })
  ))
}

export const getApplyDetailAfterLottery = async (page: Page, url: string) => {
  await page.waitFor(1000)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await logging(page)
  return (await page.evaluate(() =>
    Array.from(document.querySelectorAll('table > tbody > tr'))
      .slice(1) // ページ上部に抽選状況のテーブルがある
      .slice(0, -2) // テーブルのフッター部分を除去
      .map(tr => {
        // ex:"星野みなみ【7/28 神奈川 第１部】乃木坂46 23rdシングル発売記念 個別握手会"
        const itemName = tr.querySelector('td:nth-child(1)')!.textContent!
        // ex:"1,050円"
        const unitPrice = tr.querySelector('td:nth-child(2)')!.textContent!
        // ex:"3個"
        const applicationQuantity = tr.querySelector('td:nth-child(3)')!.textContent!
        const td4 = tr.querySelector('td:nth-child(4)')
        let winningQuantity: string
        if (td4 !== null) {
          // ex:"3個"
          winningQuantity = td4.textContent!
        } else {
          winningQuantity = ''
        }
        const td5 = tr.querySelector('td:nth-child(5)')
        let subtotal: string
        if (td5 !== null) {
          // ex:"3,150円"
          subtotal = td5.textContent!
        } else {
          subtotal = ''
        }

        const reslut: ApplyDetail = {
          itemName,
          unitPrice,
          applicationQuantity,
          winningQuantity,
          subtotal
        }

        return reslut
      })
  ))
}

export const getGoodsPageUrl = async (page: Page, eventUrl: string) => {
  await page.waitFor(1000)
  await page.goto(eventUrl, { waitUntil: 'domcontentloaded' })
  await logging(page)
  return page.evaluate(() => {
    const a: A | null = document.querySelector('div.itemContent._border > p > a') as A
    if (a === null) {
      return null
    }
    return a.href
  })
}

export const getGoodsList = async (page: Page, url: string) => {
  await page.waitFor(1000)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await logging(page)
  return page.evaluate(() => {
    const title = document.querySelector('h3')!.textContent
    const form = document.querySelector('form')!
    const buttons = Array.from(form.querySelectorAll('button')).map(button => button.textContent)
    const tables = Array.from(form.querySelectorAll('table'))
      .map(table => Array.from(table.querySelectorAll('tr'))
        .map(tr => Array.from(tr.querySelectorAll('th, td'))
          .map(td => {
            const select = td.querySelector('select')
            if (select !== null) {
              return select.value
            }
            return td.textContent
          })
        )
      )//firestoreはネストした配列を扱えないので、keyがnumberのobjectに変換する
      .map(table => {
        const newTable: { [key: number]: (string | null)[] } = {}
        table.forEach((tr, i) => newTable[i] = tr)
        return newTable
      })

    const details = tables.map((table, index) => {
      return {
        detailName: buttons[index],
        status: table
      }
    })

    return { eventName: title, details: details }
  })
}
