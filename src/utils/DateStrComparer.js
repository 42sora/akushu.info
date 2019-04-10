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
