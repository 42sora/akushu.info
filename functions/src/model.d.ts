interface ScrapingFortuneMessage {
  userID: string
  email: string
  password: string
}

interface EntryListData {
  url: string
  entryDate: string
}

interface FortuneDetail {
  memberName: string
  eventDate: string
  eventPlace: string
  partName: string
  amont: number
}

interface FortuneAggregateResult {
  eventDate: string
  eventPlace: string
  tickets: Ticket[]
}

interface Ticket {
  memberName: string
  partName: string
  amont: number
}

interface A extends Element {
  href: string
}

interface Array<T> {
  includes(arg: string): boolean
}

interface HTMLCollectionOf<T extends Element> extends HTMLCollectionBase {
  login_form: HTMLFormElement
}
