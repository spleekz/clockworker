import { makeAutoObservable } from 'mobx'

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

  playerEntering(): void {
    setTimeout(() => {
      this.player.movement.autoMove({
        start: this.player.movement.position,
        end: { x: 0, y: 0 },
        state: this.player.movement.movementStates.entering,
      })
    }, 300)
  }
}
