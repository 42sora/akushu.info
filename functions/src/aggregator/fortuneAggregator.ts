const ticketsMerge = (array: Ticket[], addObj: Ticket) => {
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
const merge = (
  array: FortuneAggregateResult[],
  addObj: FortuneAggregateResult
) => {
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

export const aggregate = (details: FortuneDetail[]) =>
  details
    .map(item => {
      return {
        eventDate: item.eventDate,
        eventPlace: item.eventPlace,
        tickets: [
          {
            memberName: item.memberName,
            partName: item.partName,
            amont: item.amont
          }
        ]
      }
    })
    .reduce((a: FortuneAggregateResult[], c) => merge(a, c), [])
