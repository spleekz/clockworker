import { CharactersController } from './characters/controller'
import { PlayerCharacter, PlayerCharacterConfig } from './characters/player/character'

type CreatePlayerCharacterConfig = {
  characterController: CharactersController
  characterConfig: PlayerCharacterConfig
}
export class Player {
  character: PlayerCharacter | null = null
  createCharacter = async (config: CreatePlayerCharacterConfig): Promise<void> => {
    await config.characterController.createCharacter('player', config.characterConfig)
    this.character = config.characterController.list.player
  }
}
