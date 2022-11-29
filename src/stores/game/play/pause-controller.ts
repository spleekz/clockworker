import { makeAutoObservable } from 'mobx'

import { SharedPlayMethods } from './shared-methods/shared-methods'

type Config = {
  sharedMethods: SharedPlayMethods
}
export class GamePauseController {
  private sharedMethods: SharedPlayMethods

  constructor(config: Config) {
    this.sharedMethods = config.sharedMethods
    makeAutoObservable(this)
  }

  isGamePaused = false
  pauseGame = (): void => {
    this.sharedMethods.playerCharacter.pauseAutomove()
    this.isGamePaused = true
  }
  resumeGame = (): void => {
    this.sharedMethods.playerCharacter.resumeAutomove()
    this.isGamePaused = false
  }
  toggleGamePause = (): void => {
    if (this.isGamePaused) {
      this.resumeGame()
    } else {
      this.pauseGame()
    }
  }
}
