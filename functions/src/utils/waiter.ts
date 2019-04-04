export default class Waiter {
  resolve: () => void

  constructor () {
    this.resolve = () => console.warn('not initialized.')
  }

  notify () {
    this.resolve()
  }

  wait () {
    return new Promise(resolve => {
      this.resolve = resolve
    })
  }
}
