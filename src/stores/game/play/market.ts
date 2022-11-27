type MarketConfig = {
  name: string
}
export class Market {
  name: string

  constructor(config: MarketConfig) {
    this.name = config.name
  }
}
