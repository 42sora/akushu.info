interface ScrapingFortuneMessage {
  userID: string
  email: string
  password: string
}

interface entryListData {
  url: string
  entryDate: string
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
