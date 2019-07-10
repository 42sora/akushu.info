interface GoodsList {
  [key: string]: GoodsItem[]
}

interface GoodsItem {
  eventName: string
  details: GoodsDetail[]
}

interface GoodsDetail {
  detailName: string
  status: string[][]
}

type State = '-' | '*' | number

interface SoldOutList {
  goodsName: string
  events: Event[]
}

interface Event {
  eventDetail: string,
  tickets: Ticket[]
}

interface Ticket {
  memberName: string,
  partName: string,
  state: State
}

const values = (o: any) => Object.keys(o).map(key => o[key])

export const firestoreToGoodsList = (goodsList: any): GoodsList => {
  for (const events of values(goodsList)) {
    for (const event of events) {
      for (const detail of event.details) {
        const statusArray: any = []
        for (const key of Object.keys(detail.status)) {
          statusArray[key] = detail.status[key]
        }
        detail.status = statusArray
      }
    }
  }
  return goodsList
}

const eventNameToNumber = (eventName: string) => {
  const parsed = /第([0-9]+)次/.exec(eventName)
  if (parsed === null) {
    return -1
  }
  return parseInt(parsed[1], 10)
}

export const aggregateSoldOut = (goodsList: GoodsItem[]) => {

  const desc = goodsList.reverse()

  const findNumber = (detailName: string, memberName: string, partName: string) => {
    for (const event of desc) {
      const detail = event.details.find(d => d.detailName === detailName)
      if (detail === undefined) {
        continue
      }

      const status = detail.status.find(s => s[0] === memberName)
      if (status === undefined) {
        continue
      }

      const partIndex = detail.status[0].indexOf(partName)

      const state = status[partIndex]
      if (state === undefined) {
        continue
      }

      if (state.includes('0')) {
        return eventNameToNumber(event.eventName)
      }

    }

    return -1
  }

  const getToState = (detailName: string, memberName: string, partName: string) =>
    (currentState: string): State => {
      if (currentState.includes('0')) {
        return '*'
      } else if (currentState.includes('---')) {
        return '-'
      } else if (currentState.includes("SOLD OUT")) {
        return findNumber(detailName, memberName, partName)
      } else {
        return -1
      }
    }

  const base: GoodsItem = {
    eventName: desc[0].eventName,
    details: []
  }

  for (const goods of desc) {
    for (const detail of goods.details) {
      if (!base.details.some(baseDetail => baseDetail.detailName === detail.detailName)) {
        base.details.push(detail)
      }
    }
  }

  const reslut: SoldOutList = {
    goodsName: base.eventName,
    events: base.details.map(detail => {
      return {
        eventDetail: detail.detailName,
        tickets: detail.status.slice(1).map(status => {
          const parts = detail.status[0].slice(1)
          const member = status[0]
          return parts.map((part, i) => {
            const toState = getToState(detail.detailName, member, part)
            return {
              memberName: member,
              partName: part,
              state: toState(status[i + 1])
            }
          })
        }).reduce((pre, cur) => pre.concat(cur))
      }
    })
  }

  return reslut
}
