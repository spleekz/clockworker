import { AppStore } from 'stores/app.store'
import { GameStore } from 'stores/game/store'
import { KeyboardStore } from 'stores/keyboard.store'

export class RootStore {
  appStore = new AppStore()
  keyboardStore = new KeyboardStore()
  createGameStore = (): GameStore => {
    return new GameStore({
      keyboard: this.keyboardStore,
    })
  }
}
