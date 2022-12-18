import { makeAutoObservable } from 'mobx'

import { CharacterController } from './characters/controller'
import { SharedPlayMethods } from './shared-methods/shared-methods'

type PauseControlsConfig = { prohibitorName: string }

type Config = {
  characterController: CharacterController
  sharedMethods: SharedPlayMethods
}
export class GamePauseController {
  private characterController: CharacterController
  private sharedMethods: SharedPlayMethods

  constructor(config: Config) {
    this.characterController = config.characterController
    this.sharedMethods = config.sharedMethods
    makeAutoObservable(this)
  }

  //!Пауза
  pauseCharactersMovement = (prohibitorName: string): void => {
    this.characterController.activeCharacters.forEach((character) => {
      character.movement.movementUsageController.addProhibitor(prohibitorName)
    })
  }
  pauseHandlingPlayerCharacterMovementKeys = (prohibitorName: string): void => {
    this.sharedMethods.playerCharacter.addMovementKeysProhibitor(prohibitorName)
  }

  onPause = ({ prohibitorName }: PauseControlsConfig): void => {
    this.pauseCharactersMovement(prohibitorName)
    this.pauseHandlingPlayerCharacterMovementKeys(prohibitorName)
  }

  //!Возобновление
  resumeCharactersMovement = (prohibitorName: string): void => {
    this.characterController.activeCharacters.forEach((character) => {
      character.movement.movementUsageController.removeProhibitor(prohibitorName)
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
