import { makeAutoObservable } from 'mobx'

export class GameSetupFormStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  playerName = ''
  setPlayerName(name: string): void {
    this.playerName = name
  }

  marketName = ''
  setMarketName(name: string): void {
    this.marketName = name
  }
}
