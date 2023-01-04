import { makeAutoObservable } from 'mobx'

import { Popup } from 'stores/entities/popup'
import { PopupHistory } from 'stores/entities/popup-history'
import { PopupsController } from 'stores/entities/popups-controller'

import { GamePauseController } from './pause-controller'

type Config = {
  popupHistory: PopupHistory
  pauseController: GamePauseController
}

export class GamePopups {
  history: PopupHistory = {} as PopupHistory
  private pauseController: GamePauseController

  controller: PopupsController<'pauseMenu' | 'settingsMenu'>

  constructor(config: Config) {
    const { popupHistory, pauseController } = config
    this.history = popupHistory
    this.pauseController = pauseController

    this.controller = new PopupsController(
      {
        pauseMenu: this.pauseMenu,
        settingsMenu: this.settingsMenu,
      },
      this.history,
    )

    makeAutoObservable(this)
  }

  pauseMenu = new Popup({
    onOpen: () => this.pauseController.pauseGame(),
    onClose: () => this.pauseController.resumeGame(),
  })
  settingsMenu = new Popup()
}
