import { makeAutoObservable } from 'mobx'

import { KeyboardStore } from 'stores/keyboard.store'
import { SettingsStore } from 'stores/settings.store'

import { GameOpening } from './opening'
import { DataFromGameSetupForm, GamePlayStore } from './play/store'
import { GameSetupForm } from './setup-form'

type GameScreen = 'createHero' | 'play'

type GameStoreConfig = {
  settings: SettingsStore
  keyboard: KeyboardStore
}

export class GameStore {
  protected settings: SettingsStore
  protected keyboard: KeyboardStore

  constructor(config: GameStoreConfig) {
    Object.assign(this, config)

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Экран
  screen: GameScreen = 'createHero'
  setScreen(screen: GameScreen): void {
    this.screen = screen
  }

  //!Опенинг
  opening = new GameOpening()

  //!GameFormStore
  gameSetupFormStore = new GameSetupForm()

  //!PlayStore
  createGamePlayStore(): GamePlayStore {
    const dataFromGameSetupForm: DataFromGameSetupForm = {
      playerName: this.gameSetupFormStore.playerName,
      marketName: this.gameSetupFormStore.marketName,
    }

    return new GamePlayStore({
      settings: this.settings,
      keyboard: this.keyboard,
      dataFromGameSetupForm,
    })
  }
}
