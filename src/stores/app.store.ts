import { makeAutoObservable } from 'mobx'

import { Popup } from './entities/popup'
import { PopupHistory } from './entities/popup-history'
import { PopupsController } from './entities/popups-controller'

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

  popupHistory = new PopupHistory()

  popupsController = new PopupsController(
    {
      quitGameConfirm: this.quitGameConfirm,
      quitInMainMenuConfirm: this.quitInMainMenuConfirm,
      settingsMenu: this.settingsMenu,
    },
    this.popupHistory,
  )
}
