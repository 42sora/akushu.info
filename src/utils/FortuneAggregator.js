const ticketsMerge = (array, addObj) => {
  let exists = false
  for (const src of array) {
    if (
      src.memberName === addObj.memberName &&
      src.partName === addObj.partName
    ) {
      exists = true
      src.amont += addObj.amont
    }
  }
  if (!exists) {
    array.push(addObj)
  }
}
const merge = (array, addObj) => {
  let exists = false
  for (const src of array) {
    if (
      src.eventDate === addObj.eventDate &&
      src.eventPlace === addObj.eventPlace
    ) {
      exists = true
      for (const addTicket of addObj.tickets) {
        ticketsMerge(src.tickets, addTicket)
      }
    }
  }
  if (!exists) {
    array.push(addObj)
  }
  return array
}

/**
 * イベント開催月日には年が含まれていないので、申込日時から年を算出する。
 * @param {string} entryDate 申込日時(ex: "2018-01-01")
 * @param {string} eventMonthDay イベント開催月日(ex: "7/16")
 */
const toEventDate = (entryDateStr, eventMonthDay) => {
  const [entryYear, entryMonth, entryDay] = entryDateStr
    .split('-').map(s => parseInt(s))
  const [eventMonth, eventDay] = eventMonthDay
    .split('/').map(s => parseInt(s))

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

const normalizePartName = (partName) => {
  if (partName.startsWith('第')) {
    return partName.substring(1)
  }
  return partName
}

const normalizeMemberName = (memberName) => {
  return memberName.replace(/\s+/g, '')
}

const toEvent = (entry, detail) => {
  const entryDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/.exec(entry.entryDate)[0]

  const itemName = detail.itemName
  const memberName = normalizeMemberName(itemName.substring(0, itemName.indexOf('【')))
  const bracketed = itemName
    .substring(itemName.indexOf('【') + 1, itemName.indexOf('】'))
    .split(/\s/)
  const eventDate = toEventDate(entryDate, bracketed[0])
  const eventPlace = bracketed[1]
  const partName = normalizePartName(bracketed[2])
  const quantity = parseInt(detail.quantity.replace(/[^0-9^.]/g, ''), 10)
  const unitPrice = parseInt(detail.unitPrice.replace(/[^0-9^.]/g, ''), 10)
  const ticketAmont = quantity * Math.floor(unitPrice / 1000)

  const reslut = {
    eventDate: eventDate,
    eventPlace: eventPlace,
    tickets: [
      {
        memberName: memberName,
        partName: partName,
        amont: ticketAmont
      }
    ]
  }
  return reslut
}

export const aggregateEntry = (entryList) => {
  const resluts = []
  for (const entry of entryList) {
    for (const detail of entry.details) {
      merge(resluts, toEvent(entry, detail))
    }
  }
  return resluts
}
