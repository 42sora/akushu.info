export const compareDateStr = (a, b) => {
  if (a === b) { return 0 }
  const splitedA = a.split('-').map(x => parseInt(x, 10))
  const splitedB = b.split('-').map(x => parseInt(x, 10))
  if (splitedA[0] < splitedB[0] ||
  (splitedA[0] === splitedB[0] && splitedA[1] < splitedB[1]) ||
  (splitedA[0] === splitedB[0] && splitedA[1] === splitedB[1] && splitedA[2] < splitedB[2])) {
    return -1
  } else {
    return 1
  }
}

/**
 *日付文字列(yyyy-MM-dd)aとbを比較しaの方が過去の場合true
 * @param string a
 * @param string b
 */
export const isPast = (a, b) => {
  return compareDateStr(a, b) < 0
}

/**
 * 現在の日付を日付文字列(yyyy-MM-dd)として取得する
 */
export const getNowDateStr = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  return year + '-' + month + '-' + day
}

/**
 * 日付文字列yyyy年MM月dd日をyyyy-MM-ddに変換する
 * @param {*} str 日付文字列(yyyy年MM月dd日)
 */
export const format = str => {
  return str.replace('年', '-').replace('月', '-').replace(/日.*/, '')
}
