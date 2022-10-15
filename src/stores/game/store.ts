import { makeAutoObservable } from 'mobx'

import { KeyboardStore } from 'stores/keyboard.store'

import { delay } from 'lib/async'

import { DataFromPreGameForm, GamePlayStore } from './play/store'
import { PreGameForm } from './pre-game-form'
import { TransitionScreen } from './transition-screen'

type GameScreen = 'preGameForm' | 'play'

type GameStoreConfig = {
  keyboard: KeyboardStore
}

export class GameStore {
  protected keyboard: KeyboardStore

  constructor(config: GameStoreConfig) {
    this.keyboard = config.keyboard

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Экран
  screen: GameScreen = 'preGameForm'
  setScreen = (screen: GameScreen): void => {
    this.screen = screen
  }

  //!Опенинг
  opening = new TransitionScreen({
    appearanceMs: 1500,
    disappearanceMs: 1500,
    durationMs: 3500,
    background: '#000000',
  })

  //!PreGameStore
  preGameForm = new PreGameForm()

  //!PlayStore
  playStore: GamePlayStore | null = null

  createGamePlayStore = (): GamePlayStore => {
    const dataFromPreGameForm: DataFromPreGameForm = {
      playerCharacterName: this.preGameForm.playerCharacterName,
      marketName: this.preGameForm.marketName,
    }

    const gamePlayStore = new GamePlayStore({
      keyboard: this.keyboard,
      dataFromPreGameForm,
    })

    this.playStore = gamePlayStore

    return gamePlayStore
  }

  startGame = async (): Promise<void> => {
    if (this.playStore) {
      this.playStore.setupGame()
      await this.opening.open()
      await delay(this.opening.durationMs)
      await this.opening.close()
      this.playStore.run()
    }
  }
}
