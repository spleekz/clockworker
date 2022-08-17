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

  get background(): string {
    return '#000000'
  }

  isOpening = false
  show(): Promise<void> {
    this.isOpening = true
    return new Promise((resolve) => {
      setTimeout(() => {
        setTimeout(() => {
          this.isOpening = false
          resolve()
        }, this.durationMs + this.transitionMs)
      }, this.transitionMs)
    })
  }
}
