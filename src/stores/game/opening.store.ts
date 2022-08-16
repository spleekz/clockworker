import { makeAutoObservable } from 'mobx'

export class GameOpeningStore {
  constructor() {
    makeAutoObservable(this)
  }

  //Длительность появления / исчезновения
  get transitionMs(): number {
    return 1500
  }
  //Длительность статичной картинки
  get durationMs(): number {
    return 3500
  }

  background = '#000000'

  isOpening = false
  show(): Promise<void> {
    return new Promise((resolve) => {
      this.isOpening = true
      setTimeout(() => {
        this.isOpening = false
        resolve()
      }, this.durationMs + this.transitionMs)
    })
  }
}
