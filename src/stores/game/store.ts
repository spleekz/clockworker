import { makeAutoObservable } from 'mobx'

import { KeyboardStore } from 'stores/keyboard.store'
import { SettingsStore } from 'stores/settings.store'

import { delay } from 'lib/async'

import { DataFromGameSetupForm, GamePlayStore } from './play/store'
import { GameSetupForm } from './setup-form'
import { TransitionScreen } from './transition-screen'

type GameScreen = 'createHero' | 'play'

type GameStoreConfig = {
  settings: SettingsStore
  keyboard: KeyboardStore
}

export class GameStore {
  protected settings: SettingsStore
  protected keyboard: KeyboardStore

  constructor(config: GameStoreConfig) {
    this.settings = config.settings
    this.keyboard = config.keyboard

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Экран
  screen: GameScreen = 'createHero'
  setScreen(screen: GameScreen): void {
    this.screen = screen
  }

  //!Опенинг
  opening = new TransitionScreen({
    appearanceMs: 1500,
    disappearanceMs: 1500,
    durationMs: 3500,
    background: '#000000',
  })

  //!GameSetupForm
  gameSetupForm = new GameSetupForm()

  //!PlayStore
  playStore: GamePlayStore | null = null

  createGamePlayStore(): GamePlayStore {
    const dataFromGameSetupForm: DataFromGameSetupForm = {
      playerName: this.gameSetupForm.playerName,
      marketName: this.gameSetupForm.marketName,
    }

    const gamePlayStore = new GamePlayStore({
      settings: this.settings,
      keyboard: this.keyboard,
      dataFromGameSetupForm,
    })

    this.playStore = gamePlayStore

    return gamePlayStore
  }

  async startGame(): Promise<void> {
    if (this.playStore) {
      this.playStore.setupGame()
      await this.opening.open()
      await delay(this.opening.durationMs)
      await this.opening.close()
      this.playStore.run()
    }
  }
}
