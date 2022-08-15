import { makeAutoObservable } from 'mobx'

import { CustomUserData } from './game/game.store'

type AppScreen = 'main' | 'createHero' | 'game'

export class AppStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Экран
  screen: AppScreen = 'main'
  setScreen(screen: AppScreen): void {
    this.screen = screen
  }

  //!Выход из игры
  quitGame(): void {
    window.close()
  }
  isQuitGameConfirmOpened = false
  openQuitGameConfirm(): void {
    this.isQuitGameConfirmOpened = true
  }
  closeQuitGameConfirm(): void {
    this.isQuitGameConfirmOpened = false
  }
  toggleQuitGameConfirm(): void {
    this.isQuitGameConfirmOpened = !this.isQuitGameConfirmOpened
  }

  //!Выход в главное меню
  isQuitInMainMenuConfirmOpened = false
  openQuitInMainMenuConfirm(): void {
    this.isQuitInMainMenuConfirmOpened = true
  }
  closeQuitInMainMenuConfirm(): void {
    this.isQuitInMainMenuConfirmOpened = false
  }
  toggleQuitInMainMenuConfirm(): void {
    this.isQuitInMainMenuConfirmOpened = !this.isQuitInMainMenuConfirmOpened
  }

  //!Настройки
  isSettingsMenuOpened = false
  openSettingsMenu(): void {
    this.isSettingsMenuOpened = true
  }
  closeSettingsMenu(): void {
    this.isSettingsMenuOpened = false
  }

  //!Открытые попапы
  openedPopupsCount = 0
  increaseOpenedPopupsCount(): void {
    this.openedPopupsCount += 1
  }
  decreaseOpenedPopupsCount(): void {
    this.openedPopupsCount -= 1
  }
  get isAnyPopupOpened(): boolean {
    return this.openedPopupsCount > 0
  }

  //!Данные пользователя для стора игры
  customUserDataForGameStore: CustomUserData | null = null
  setCustomUserDataForGameStore(customUserData: CustomUserData): void {
    this.customUserDataForGameStore = customUserData
  }
  clearCustomUserDataForGameStore(): void {
    this.customUserDataForGameStore = null
  }
}
