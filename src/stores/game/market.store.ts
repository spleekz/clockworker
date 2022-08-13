import { makeAutoObservable } from 'mobx'

type MarketStoreConfig = {
  name: string
}

export class MarketStore {
  name: string

  constructor(config: MarketStoreConfig) {
    Object.assign(this, config)

    makeAutoObservable(this, {}, { autoBind: true })
  }
}
