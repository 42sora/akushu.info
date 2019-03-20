interface ScrapingFortuneMessage {
  userID: string
  email: string
  password: string
}

interface A extends Element {
  href: string
}

interface Array<T> {
  includes(arg: string): any
}

interface HTMLCollectionOf<T extends Element> extends HTMLCollectionBase {
  login_form: any
}
