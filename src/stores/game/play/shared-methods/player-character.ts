import { PlayerCharacter } from '../characters/player/player-character'

export class PlayerCharacterSharedMethods {
  private playerCharacter: PlayerCharacter | null = null
  setPlayerCharacter = (playerCharacter: PlayerCharacter): void => {
    this.playerCharacter = playerCharacter
  }

  addMovementKeysProhibitor = (prohibitorName: string): void => {
    this.playerCharacter?.movement.addMovementKeysProhibitor(prohibitorName)
  }
  removeMovementKeysProhibitor = (prohibitorName: string): void => {
    this.playerCharacter?.movement.removeMovementKeysProhibitor(prohibitorName)
  }
}
