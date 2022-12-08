import { PlayerCharacter } from '../characters/player/character'

export class PlayerCharacterSharedMethods {
  private playerCharacter: PlayerCharacter | null = null
  setPlayerCharacter = (playerCharacter: PlayerCharacter): void => {
    this.playerCharacter = playerCharacter
  }

  addMovementKeysProhibitor = (prohibitorName: string): void => {
    this.playerCharacter?.movement.keys.usageController.addProhibitor(prohibitorName)
  }
  removeMovementKeysProhibitor = (prohibitorName: string): void => {
    this.playerCharacter?.movement.keys.usageController.removeProhibitor(prohibitorName)
  }
}
