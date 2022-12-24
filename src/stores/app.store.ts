import { makeAutoObservable } from 'mobx'

import { Popup } from './entities/popup'

type AppScreen = 'main' | 'game'

export class AppStore {
  constructor() {
    makeAutoObservable(this)
  }

  screen: AppScreen = 'main'
  setScreen = (screen: AppScreen): void => {
    this.screen = screen
  }

  quitGame = (): void => {
    window.close()
  }

  quitGameConfirm = new Popup()

  quitInMainMenuConfirm = new Popup()

  settingsMenu = new Popup()
}
