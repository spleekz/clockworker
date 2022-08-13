import { AppStore } from 'stores/app.store'
import { CustomUserData, GameStore } from 'stores/game/game.store'
import { KeyboardStore } from 'stores/keyboard.store'
import { SettingsStore } from 'stores/settings.store'

type CreateGameStoreConfig = {
  customUserData: CustomUserData
}

export class RootStore {
  appStore = new AppStore()
  settingsStore = new SettingsStore()
  keyboardStore = new KeyboardStore()
  createGameStore = (config: CreateGameStoreConfig): GameStore => {
    return new GameStore({
      appStore: this.appStore,
      settings: this.settingsStore,
      keyboard: this.keyboardStore,
      customUserData: config.customUserData,
    })
  }
}
