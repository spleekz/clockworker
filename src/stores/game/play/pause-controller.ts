import { makeAutoObservable } from 'mobx'

import { CharactersController } from './characters/controller'
import { SharedPlayMethods } from './shared-methods/shared-methods'

type Config = {
  charactersController: CharactersController
  sharedMethods: SharedPlayMethods
}
export class GamePauseController {
  private charactersController: CharactersController
  private sharedMethods: SharedPlayMethods

  constructor(config: Config) {
    this.charactersController = config.charactersController
    this.sharedMethods = config.sharedMethods
    makeAutoObservable(this)
  }

  //!Пауза
  pauseCharactersMovement = (): void => {
    this.charactersController.activeCharacters.forEach((character) => {
      character.movement.movementUsageController.addProhibitor('pause')
    })
  }
  pauseHandlingPlayerCharacterMovementKeys = (): void => {
    this.sharedMethods.playerCharacter.addMovementKeysProhibitor('pause')
  }

  onPause = (): void => {
    this.pauseCharactersMovement()
    this.pauseHandlingPlayerCharacterMovementKeys()
  }

  //!Возобновление
  resumeCharactersMovement = (): void => {
    this.charactersController.activeCharacters.forEach((character) => {
      character.movement.movementUsageController.removeProhibitor('pause')
    })
  }
  resumeHandlingPlayerCharacterMovementKeys = (): void => {
    this.sharedMethods.playerCharacter.removeMovementKeysProhibitor('pause')
  }

  onResume = (): void => {
    this.resumeCharactersMovement()
    this.resumeHandlingPlayerCharacterMovementKeys()
  }

  isGamePaused = false
  pauseGame = (): void => {
    this.isGamePaused = true
    this.onPause()
  }
  resumeGame = (): void => {
    this.isGamePaused = false
    this.onResume()
  }
  toggleGamePause = (): void => {
    if (this.isGamePaused) {
      this.resumeGame()
    } else {
      this.pauseGame()
    }
  }
}
