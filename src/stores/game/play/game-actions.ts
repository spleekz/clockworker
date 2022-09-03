import { makeAutoObservable } from 'mobx'

import { delay } from 'lib/async'

import { Player } from './player/player'

type GameActionsConfig = {
  player: Player
}

export class GameActions {
  private player: Player

  constructor(config: GameActionsConfig) {
    this.player = config.player

    makeAutoObservable(this, {}, { autoBind: true })
  }

  async playerEntering(): Promise<void> {
    await delay(300)
    return new Promise((resolve) => {
      this.player.movement.setCurrentMovementType('entering')
      this.player.movement
        .autoMove({
          start: this.player.movement.position,
          end: { x: 0, y: 0 },
        })
        .then(() => resolve())
    })
  }
}
