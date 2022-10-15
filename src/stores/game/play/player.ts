import { CharactersController } from './characters/controller'
import { PlayerCharacter, PlayerCharacterConfig } from './characters/player/player-character'

type CreatePlayerCharacterConfig = {
  charactersController: CharactersController
  characterConfig: PlayerCharacterConfig
}

export class Player {
  character: PlayerCharacter | null = null
  createCharacter = (config: CreatePlayerCharacterConfig): void => {
    config.charactersController.createCharacter('playerCharacter', config.characterConfig)
    this.character = config.charactersController.list.playerCharacter
  }
}
