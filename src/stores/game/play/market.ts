import { makeAutoObservable } from 'mobx'

type MarketConfig = {
  name: string
}

export class Market {
  name: string

  constructor(config: MarketConfig) {
    Object.assign(this, config)

    makeAutoObservable(this, {}, { autoBind: true })
  }
}
