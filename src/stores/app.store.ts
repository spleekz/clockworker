import { makeAutoObservable } from 'mobx'

import { Popup } from './entities/popup'
import { PopupHistory } from './entities/popup-history'
import { PopupsController } from './entities/popups-controller'
import { closeAllUnclosedPopups } from './lib/popups'

type AppScreen = 'main' | 'game'

export class AppStore {
  constructor() {
    makeAutoObservable(this)
  }

  screen: AppScreen = 'main'
  setScreen = (screen: AppScreen): void => {
    closeAllUnclosedPopups(this.popupHistory)
    this.screen = screen
  }

  quitGame = (): void => {
    closeAllUnclosedPopups(this.popupHistory)
    window.close()
  }

  quitGameConfirm = new Popup({ name: 'app_quitGameConfirm' })

  quitInMainMenuConfirm = new Popup({ name: 'app_quitInMainMenuConfirm' })

  settingsMenu = new Popup({ name: 'app_settingsMenu' })

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
