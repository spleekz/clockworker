import { makeAutoObservable } from 'mobx'

import { closeAllUnclosedPopups } from '../lib/popups'
import { PopupHistory } from '../popup-history'
import { AppPopups } from './popups'

type AppScreen = 'main' | 'game'

type Config = {
  popupHistory: PopupHistory
}

export class AppStore {
  private popupHistory: PopupHistory

  popups: AppPopups

  constructor(config: Config) {
    const { popupHistory } = config

    this.popupHistory = popupHistory

    this.popups = new AppPopups(this.popupHistory)

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
