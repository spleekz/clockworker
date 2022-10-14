import { makeAutoObservable } from 'mobx'

import { delay } from 'lib/async'

import { PlayerCharacter } from './characters/player/player-character'

type GameActionsConfig = {
  playerCharacter: PlayerCharacter
}

export class GameActions {
  private playerCharacter: PlayerCharacter

  constructor(config: GameActionsConfig) {
    this.playerCharacter = config.playerCharacter

    makeAutoObservable(this, {}, { autoBind: true })
  }

  async playerEntering(): Promise<void> {
    await delay(300)
    return new Promise((resolve) => {
      this.playerCharacter.movement.setCurrentMovementType('entering')
      this.playerCharacter.movement
        .automove({
          from: this.playerCharacter.position,
          to: { x: 0, y: 0 },
        })
        .then(() => resolve())
    })
  }
}
