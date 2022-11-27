import { CharactersController } from './characters/controller'
import { PlayerCharacter, PlayerCharacterConfig } from './characters/player/player-character'

type CreatePlayerCharacterConfig = {
  charactersController: CharactersController
  characterConfig: PlayerCharacterConfig
}
export class Player {
  character: PlayerCharacter | null = null
  createCharacter = async (config: CreatePlayerCharacterConfig): Promise<void> => {
    await config.charactersController.createCharacter('player', config.characterConfig)
    this.character = config.charactersController.list.player
  }
}
