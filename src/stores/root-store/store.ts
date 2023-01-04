import isElectron from 'is-electron'

import { AppStore } from 'stores/app.store'
import { GameStore } from 'stores/game/store'
import { KeyboardStore } from 'stores/keyboard.store'
import { AppSettingsStore } from 'stores/settings/settings.store'
import { UpdateStore } from 'stores/update.store'

export class RootStore {
  appStore = new AppStore()
  appSettingsStore = new AppSettingsStore()
  updateStore: UpdateStore | null = isElectron()
    ? new UpdateStore({ appSettings: this.appSettingsStore.current })
    : null
  keyboardStore = new KeyboardStore()
  createGameStore = (): GameStore => {
    return new GameStore({
      appStore: this.appStore,
      keyboard: this.keyboardStore,
    })
  }
}
