import { makeAutoObservable } from 'mobx'

export class Popup {
  constructor() {
    makeAutoObservable(this)
  }

  isOpened = false

  open = (): void => {
    this.isOpened = true
  }

  close = (): void => {
    this.isOpened = false
  }

  toggle = (): void => {
    if (!this.isOpened) {
      this.open()
    } else {
      this.close()
    }
  }
}
