import isElectron from 'is-electron'

import { AppStore } from 'stores/app.store'
import { GameStore } from 'stores/game/store'
import { KeyboardStore } from 'stores/keyboard.store'
import { UpdateStore } from 'stores/update-store'

export class RootStore {
  appStore = new AppStore()
  updateStore: UpdateStore | null = isElectron() ? new UpdateStore() : null
  keyboardStore = new KeyboardStore()
  createGameStore = (): GameStore => {
    return new GameStore({
      keyboard: this.keyboardStore,
    })
  }
}
