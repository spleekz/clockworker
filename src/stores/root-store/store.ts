import { AppStore } from 'stores/app.store'
import { GameStore } from 'stores/game/store'
import { KeyboardStore } from 'stores/keyboard.store'
import { SettingsStore } from 'stores/settings.store'

export class RootStore {
  appStore = new AppStore()
  settingsStore = new SettingsStore()
  keyboardStore = new KeyboardStore()
  createGameStore = (): GameStore => {
    return new GameStore({
      settings: this.settingsStore,
      keyboard: this.keyboardStore,
    })
  }
}
