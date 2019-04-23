interface ScrapingFortuneMessage {
  uid: string
  email: string
  password: string
}

interface Entry {
  detailURL: string
  entryNumber: string
  entryDate: string
  totalAmount: string
  eventName: string
  details: EntryDetail[]
}

interface EntryDetail {
  itemName: string
  unitPrice: string
  quantity: string
  subtotal: string
}

interface Aplly {
  detailURL: string
  applicationNumber: string
  applicationDate: string
  applicationTotalAmount: string
  eventName: string
  lotteryState: string
  lotteryResult: string
  isLotteryCompleted: boolean
  details: ApplyDetail[]
}

interface ApplyDetail {
  itemName: string
  unitPrice: string
  applicationQuantity: string
  winningQuantity: string
  subtotal: string
}

interface FortuneEvent {
  eventDate: string
  eventPlace: string
  tickets: Ticket[]
}

interface Ticket {
  memberName: string
  partName: string
  amont: number
}

type State = 'WAITING' | 'EXECUTING' | 'COMPLETED' | 'LOGIN_FAILED' | 'SYSTEM_ERROR'

interface A extends Element {
  href: string
}

interface P extends Element {
  innerText: string
}

interface Array<T> {
  includes(arg: string): boolean
}

interface HTMLCollectionOf<T extends Element> extends HTMLCollectionBase {
  login_form: HTMLFormElement
}
