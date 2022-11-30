import { PlayerCharacter } from '../characters/player/player-character'

export class PlayerCharacterSharedMethods {
  private playerCharacter: PlayerCharacter | null = null
  setPlayerCharacter = (playerCharacter: PlayerCharacter): void => {
    this.playerCharacter = playerCharacter
  }

  addMovementKeysProhibitor = (prohibitorName: string): void => {
    this.playerCharacter?.movement.movementKeysAccessController.addProhibitor(prohibitorName)
  }
  removeMovementKeysProhibitor = (prohibitorName: string): void => {
    this.playerCharacter?.movement.movementKeysAccessController.removeProhibitor(prohibitorName)
  }

  pauseAutomove = (): void => {
    this.playerCharacter?.movement.pauseAutomove()
  }
  resumeAutomove = (): void => {
    this.playerCharacter?.movement.resumeAutomove()
  }
}
