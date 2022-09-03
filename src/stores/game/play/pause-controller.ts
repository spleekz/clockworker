import { makeAutoObservable } from 'mobx'

export class GamePauseController {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  isGamePaused = false
  pauseGame(): void {
    this.isGamePaused = true
  }
  resumeGame(): void {
    this.isGamePaused = false
  }
  toggleGamePause(): void {
    if (this.isGamePaused) {
      this.resumeGame()
    } else {
      this.pauseGame()
    }
  }
}
