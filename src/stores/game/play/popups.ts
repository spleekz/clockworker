import { makeAutoObservable } from 'mobx'

import { Popup } from 'stores/entities/popup'
import { PopupsController } from 'stores/entities/popups-controller'

export class GamePopups {
  constructor() {
    makeAutoObservable(this)
  }

  pauseMenu = new Popup()
  settingsMenu = new Popup()

  controller = new PopupsController({
    pauseMenu: this.pauseMenu,
    settingsMenu: this.settingsMenu,
  })
}
