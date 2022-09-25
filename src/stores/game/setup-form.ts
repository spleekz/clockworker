import { makeAutoObservable } from 'mobx'

export class GameSetupForm {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  playerNickname = ''
  setPlayerNickname(name: string): void {
    this.playerNickname = name
  }

  marketName = ''
  setMarketName(name: string): void {
    this.marketName = name
  }
}
