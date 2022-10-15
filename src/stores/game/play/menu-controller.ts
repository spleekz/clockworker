import { makeAutoObservable } from 'mobx'

type GameMenuName = 'pause' | 'settings'

export class GameMenuController {
  constructor() {
    makeAutoObservable(this)
  }

  currentMenu: GameMenuName | null = null
  openMenu = (name: GameMenuName): void => {
    this.currentMenu = name
  }
  closeCurrentMenu = (): void => {
    this.currentMenu = null
  }
  toggle = (name: GameMenuName): void => {
    if (this.currentMenu === name) {
      this.closeCurrentMenu()
    } else {
      this.openMenu(name)
    }
  }

  get isGamePauseMenuOpened(): boolean {
    return this.currentMenu === 'pause'
  }
  get isSettingsMenuOpened(): boolean {
    return this.currentMenu === 'settings'
  }
}
