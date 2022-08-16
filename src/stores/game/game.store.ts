import { makeAutoObservable } from 'mobx'

import { KeyboardStore } from 'stores/keyboard.store'
import { SettingsStore } from 'stores/settings.store'

import { GameSetupFormStore } from './game-setup-form-store'
import { GameOpeningStore } from './opening.store'
import { DataFromGameSetupForm, GamePlayStore } from './play/game-play.store'

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
  opening = new GameOpeningStore()

  //!GameFormStore
  gameSetupFormStore = new GameSetupFormStore()

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
