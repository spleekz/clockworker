import { makeAutoObservable } from 'mobx'

type AppScreen = 'main' | 'game'

export class AppStore {
  constructor() {
    makeAutoObservable(this)
  }

  //! экран
  screen: AppScreen = 'main'
  setScreen = (screen: AppScreen): void => {
    this.screen = screen
  }

  //! выход из игры
  quitGame = (): void => {
    window.close()
  }
  isQuitGameConfirmOpened = false
  openQuitGameConfirm = (): void => {
    this.isQuitGameConfirmOpened = true
  }
  closeQuitGameConfirm = (): void => {
    this.isQuitGameConfirmOpened = false
  }
  toggleQuitGameConfirm = (): void => {
    if (this.isQuitGameConfirmOpened) {
      this.closeQuitGameConfirm()
    } else {
      this.openQuitGameConfirm()
    }
  }

  //! выход в главное меню
  isQuitInMainMenuConfirmOpened = false
  openQuitInMainMenuConfirm = (): void => {
    this.isQuitInMainMenuConfirmOpened = true
  }
  closeQuitInMainMenuConfirm = (): void => {
    this.isQuitInMainMenuConfirmOpened = false
  }
  toggleQuitInMainMenuConfirm = (): void => {
    if (this.isQuitInMainMenuConfirmOpened) {
      this.closeQuitInMainMenuConfirm()
    } else {
      this.openQuitInMainMenuConfirm()
    }
  }

  //! открытые попапы
  openedPopupsCount = 0
  increaseOpenedPopupsCount = (): void => {
    this.openedPopupsCount += 1
  }
  decreaseOpenedPopupsCount = (): void => {
    this.openedPopupsCount -= 1
  }
  get isAnyPopupOpened(): boolean {
    return this.openedPopupsCount > 0
  }
}
