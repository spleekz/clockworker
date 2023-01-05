import { makeAutoObservable } from 'mobx'

import { AppStore } from 'stores/app.store'
import { KeyboardStore } from 'stores/keyboard.store'
import { closeAllUnclosedPopups } from 'stores/lib/popups'

import { DataFromPreGameForm, GamePlayStore } from './play/store'
import { PreGameForm } from './pre-game-form'

type GameScreen = 'preGameForm' | 'play'

type GameStoreConfig = {
  appStore: AppStore
  keyboard: KeyboardStore
}

export class GameStore {
  private appStore: AppStore
  protected keyboard: KeyboardStore

  constructor(config: GameStoreConfig) {
    const { appStore, keyboard } = config

    this.appStore = appStore
    this.keyboard = keyboard

    makeAutoObservable(this)
  }

  //! экран
  screen: GameScreen = 'preGameForm'
  setScreen = (screen: GameScreen): void => {
    this.screen = screen
  }

  //! preGameStore
  preGameForm = new PreGameForm()

  //! playStore
  playStore: GamePlayStore | null = null

  createGamePlayStore = (): void => {
    const dataFromPreGameForm: DataFromPreGameForm = {
      playerCharacterName: this.preGameForm.playerCharacterName,
      marketName: this.preGameForm.marketName,
    }

    const gamePlayStore = new GamePlayStore({
      appStore: this.appStore,
      keyboard: this.keyboard,
      dataFromPreGameForm,
    })

    this.playStore = gamePlayStore
  }

  startGame = async (): Promise<void> => {
    this.createGamePlayStore()
    if (this.playStore) {
      this.playStore.run()
      this.setScreen('play')
    }
  }

  endGame = (): void => {
    closeAllUnclosedPopups(this.appStore.popupHistory)
    this.playStore?.setIsPlay(false)
    this.playStore = null
  }
}
