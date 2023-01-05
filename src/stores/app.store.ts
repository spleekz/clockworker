import { makeAutoObservable } from 'mobx'

import { Popup } from './entities/popup'
import { closeAllUnclosedPopups } from './lib/popups'
import { PopupHistory } from './popup-history'

type AppScreen = 'main' | 'game'

type Config = {
  popupHistory: PopupHistory
}

export class AppStore {
  private popupHistory: PopupHistory

  quitGameConfirm: Popup
  quitInMainMenuConfirm: Popup
  settingsMenu: Popup

  constructor(config: Config) {
    const { popupHistory } = config

    this.popupHistory = popupHistory

    this.quitGameConfirm = new Popup({ name: 'app_quitGameConfirm', history: this.popupHistory })

    this.quitInMainMenuConfirm = new Popup({
      name: 'app_quitInMainMenuConfirm',
      history: this.popupHistory,
    })

    this.settingsMenu = new Popup({ name: 'app_settingsMenu', history: this.popupHistory })

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
}
