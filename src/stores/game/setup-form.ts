import { makeAutoObservable } from 'mobx'

export class GameSetupForm {
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
