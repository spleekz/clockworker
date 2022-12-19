import { makeAutoObservable } from 'mobx'

import { CharactersController } from './characters/controller'
import { SharedPlayMethods } from './shared-methods/shared-methods'

type PauseControlsConfig = { prohibitorName: string }

type Config = {
  characterController: CharactersController
  sharedMethods: SharedPlayMethods
}

export class GamePauseController {
  private charactersController: CharactersController
  private sharedMethods: SharedPlayMethods

  constructor(config: Config) {
    this.charactersController = config.characterController
    this.sharedMethods = config.sharedMethods
    makeAutoObservable(this)
  }

  //! пауза
  pauseCharactersMovement = (prohibitorName: string): void => {
    this.charactersController.activeCharacters.forEach((character) => {
      character.movement.movementProhibitorsController.add(prohibitorName)
    })
  }
  pauseHandlingPlayerCharacterMovementKeys = (prohibitorName: string): void => {
    this.sharedMethods.playerCharacter.addMovementKeysProhibitor(prohibitorName)
  }

  onPause = ({ prohibitorName }: PauseControlsConfig): void => {
    this.pauseCharactersMovement(prohibitorName)
    this.pauseHandlingPlayerCharacterMovementKeys(prohibitorName)
  }

  //! возобновление
  resumeCharactersMovement = (prohibitorName: string): void => {
    this.charactersController.activeCharacters.forEach((character) => {
      character.movement.movementProhibitorsController.remove(prohibitorName)
    })
  }
  resumeHandlingPlayerCharacterMovementKeys = (prohibitorName: string): void => {
    this.sharedMethods.playerCharacter.removeMovementKeysProhibitor(prohibitorName)
  }

  onResume = ({ prohibitorName }: PauseControlsConfig): void => {
    this.resumeCharactersMovement(prohibitorName)
    this.resumeHandlingPlayerCharacterMovementKeys(prohibitorName)
  }

  isGamePaused = false
  pauseGame = (): void => {
    this.isGamePaused = true
    this.onPause({ prohibitorName: 'pause' })
  }
  resumeGame = (): void => {
    this.isGamePaused = false
    this.onResume({ prohibitorName: 'pause' })
  }
  toggleGamePause = (): void => {
    if (this.isGamePaused) {
      this.resumeGame()
    } else {
      this.pauseGame()
    }
  }
}
