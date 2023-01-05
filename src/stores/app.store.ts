import { makeAutoObservable } from 'mobx'

import { Popup } from './entities/popup'
import { PopupHistory } from './entities/popup-history'
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

  popupHistory = new PopupHistory()

  quitGameConfirm = new Popup({ name: 'app_quitGameConfirm', history: this.popupHistory })

  quitInMainMenuConfirm = new Popup({ name: 'app_quitInMainMenuConfirm', history: this.popupHistory })

  settingsMenu = new Popup({ name: 'app_settingsMenu', history: this.popupHistory })
}
