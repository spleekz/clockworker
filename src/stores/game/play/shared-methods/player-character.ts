import { PlayerCharacter } from '../characters/player/player-character'

export class PlayerCharacterSharedMethods {
  private playerCharacter: PlayerCharacter | null = null
  setPlayerCharacter = (playerCharacter: PlayerCharacter): void => {
    this.playerCharacter = playerCharacter
  }

  handleMovementKeys = (): void => {
    this.playerCharacter?.movement.setIsHandleMovementKeys(true)
  }
  stopHandlingMovementKeys = (): void => {
    this.playerCharacter?.movement.setIsHandleMovementKeys(false)
  }
}
