import * as puppeteer from 'puppeteer'

const LOGIN_URL = 'https://fortunemusic.jp/default/login/'
const ENTRY_LIST_URL = 'https://fortunemusic.jp/mypage/entry_list/'

const logging = async (page: puppeteer.Page) => {
  // await page.screenshot({ path: Date.now() + ".png", fullpage: true });
  // const title = await page.title();
  // console.info(title);
  const url = await page.url()
  console.info(url)
  // const cookies = await page.cookies();
  // console.info("cookie");
  // console.info(JSON.stringify(cookies, undefined, 1));
}

/**
 * イベント開催月日には年が含まれていないので、申込日時から年を算出する。
 * @param {string} entryDate 申込日時(ex: "2018-01-01")
 * @param {string} eventMonthDay イベント開催月日(ex: "7/16")
 */
const calcEventDate = (entryDateStr: string, eventMonthDay: string) => {
  const [entryYear, entryMonth, entryDay] = entryDateStr
    .split('-')
    .map(s => parseInt(s))
  const [eventMonth, eventDay] = eventMonthDay.split('/').map(s => parseInt(s))

  let eventYear
  // イベント開催月日が申込日時より過去であれば翌年開催ということ。(1年以上先のイベントは算出できないけどしょうがない)
  if (
    eventMonth > entryMonth ||
    (eventMonth === entryMonth && eventDay > entryDay)
  ) {
    eventYear = entryYear
  } else {
    eventYear = entryYear + 1
  }
  return eventYear + '-' + eventMonth + '-' + eventDay
}

const login = async (page: puppeteer.Page, email: string, password: string) => {
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
}

const getDetailURLs = async (page: puppeteer.Page) => {
  await logging(page)
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('table > tbody > tr')).map(tr => {
      const detailPageURL = (tr.querySelector('td:nth-child(1) > a') as A).href

      const entryDateText = tr.querySelector('td:nth-child(2)')!.textContent!
      const datestr = /[0-9]{4}-[0-9]{2}-[0-9]{2}/.exec(entryDateText)![0]

      return {
        url: detailPageURL,
        entryDate: datestr
      }
    })
  )
}

const getDetails = async (page: puppeteer.Page, target: any) => {
  await page.goto(target.url, { waitUntil: 'domcontentloaded' })
  return (await page.evaluate(() =>
    Array.from(document.querySelectorAll('table > tbody > tr'))
      .slice(0, -5) // テーブルのフッター部分を除去
      .map(tr => {
        // ex:"井口　眞緒【3/24 愛知 第５部】欅坂46 8thシングル発売記念個別握手会"
        const td1 = tr.querySelector('td:nth-child(1)')!.textContent
        // ex:"数量2個"
        const td3 = tr.querySelector('td:nth-child(3)')!.textContent

        return { td1, td3 }
      })
  )).map(tr => {
    const td1 = tr.td1!
    const td3 = tr.td3!
    const memberName = td1.substring(0, td1.indexOf('【'))
    const bracketed = td1
      .substring(td1.indexOf('【') + 1, td1.indexOf('】'))
      .split(/\s/)
    const eventDate = calcEventDate(target.entryDate, bracketed[0])
    const eventPlace = bracketed[1]
    const partName = bracketed[2]
    const amont = parseInt(td3.replace(/[^0-9^\.]/g, ''), 10)

    return {
      memberName,
      eventDate,
      eventPlace,
      partName,
      amont
    }
  })
}

const entryList = async (page: puppeteer.Page) => {
  const detailURLs = await getDetailURLs(page)
  const nextPageURL = await page.evaluate(() => {
    const a: A | null = document.querySelector('p.pageNext > a')
    if (a !== null) {
      return a.href
    }
    return null
  })

  if (nextPageURL) {
    await page.waitFor(1000)
    await page.goto(nextPageURL, { waitUntil: 'domcontentloaded' })
    detailURLs.push(...(await entryList(page)))
  }

  return detailURLs
}

export const getFortune = async (
  page: puppeteer.Page,
  message: ScrapingFortuneMessage
) => {
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

  // login
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' })
  await login(page, message.email, message.password)

  // get detai page URLs
  await page.waitFor(1000)
  await page.goto(ENTRY_LIST_URL, { waitUntil: 'domcontentloaded' })
  const detailURLs = await entryList(page)
  console.log(detailURLs)

  // get detail
  const details = []
  for (const detailURL of detailURLs) {
    await page.waitFor(1000)
    const detail = await getDetails(page, detailURL)
    details.push(...detail)
  }
  console.log(JSON.stringify(details, undefined, 1))
}
