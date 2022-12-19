import { makeAutoObservable } from 'mobx'

import { KeyboardStore } from 'stores/keyboard.store'

import { DataFromPreGameForm, GamePlayStore } from './play/store'
import { PreGameForm } from './pre-game-form'

type GameScreen = 'preGameForm' | 'play'

type GameStoreConfig = {
  keyboard: KeyboardStore
}

export class GameStore {
  protected keyboard: KeyboardStore

  constructor(config: GameStoreConfig) {
    this.keyboard = config.keyboard

    makeAutoObservable(this)
  }

  //! Экран
  screen: GameScreen = 'preGameForm'
  setScreen = (screen: GameScreen): void => {
    this.screen = screen
  }

  //! PreGameStore
  preGameForm = new PreGameForm()

  //! PlayStore
  playStore: GamePlayStore | null = null

  createGamePlayStore = (): void => {
    const dataFromPreGameForm: DataFromPreGameForm = {
      playerCharacterName: this.preGameForm.playerCharacterName,
      marketName: this.preGameForm.marketName,
    }

    const gamePlayStore = new GamePlayStore({
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
    this.playStore?.setIsPlay(false)
    this.playStore = null
  }
}
