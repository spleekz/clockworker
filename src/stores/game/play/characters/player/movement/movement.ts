import { ExpandedMovementDirection } from 'project-utility-types'

import { KeyboardStore } from 'stores/keyboard.store'

import { GameSettings } from '../../../settings/settings'
import {
  AutomoveDeltaX,
  AutomoveDeltaY,
  AutomoveFromTo,
  CharacterMovement,
  CharacterMovementConfig,
} from '../../movement'
import { PlayerCharacterMovementKeys } from './keys'

type PlayerCharacterMovementConfig = CharacterMovementConfig & { settings: GameSettings }
export class PlayerCharacterMovement extends CharacterMovement {
  private settings: GameSettings

  movementKeys: PlayerCharacterMovementKeys

  constructor(config: PlayerCharacterMovementConfig) {
    super({ animation: config.animation, position: config.position })
    this.settings = config.settings

    //Клавиши управления
    this.movementKeys = new PlayerCharacterMovementKeys({ settings: this.settings })
  }

  //!Обработка клавиш управления
  handleMovementKeys = (keyboard: KeyboardStore): void => {
    if (!this.movementKeys.usageController.isProhibited) {
      this.movementKeys.setPressedKeys(keyboard.pressedKeysArray)
      if (this.movementKeys.isControllerPressed) {
        //Проверка на нажатие регуляторов
        if (this.movementKeys.isRegulatorKeysPressed) {
          if (this.movementKeys.isSprintKeyPressed) {
            this.setCurrentMovementRegulator('sprint')
          }
        } else {
          this.setCurrentMovementRegulator(null)
        }

        const getMovementDirection = (): ExpandedMovementDirection | null => {
          var movementDirection: ExpandedMovementDirection | null = null

          //Убираем направления, компенсирующие друг друга (пример: вверх-вниз)
          const filteredPressedMovementDirections = this.movementKeys.pressedDirections.filter(
            (pressedDirection) => {
              return this.movementKeys.pressedDirections.every(
                (d) => d !== this.getReversedPrimitiveDirection(pressedDirection),
              )
            },
          )

          //Если длина массива 0, значит, все направления скомпенсировали друг друга - персонаж стоит на месте
          if (filteredPressedMovementDirections.length) {
            movementDirection = filteredPressedMovementDirections
              //Сортируем, чтобы названия направлений получались в едином формате
              .sort((_, b) => (b === 'down' || b === 'up' ? 1 : -1))
              .join('') as ExpandedMovementDirection
          } else {
            this.stop()
          }

          return movementDirection
        }

        const movementDirection = getMovementDirection()

        if (movementDirection) {
          this.move({ direction: movementDirection })
        }
      } else {
        this.stop()
      }
    }
  }

  //!Автомув
  automove(config: AutomoveFromTo): Promise<boolean>
  automove(config: AutomoveDeltaX): Promise<boolean>
  automove(config: AutomoveDeltaY): Promise<boolean>
  override automove(config: any): Promise<boolean> {
    this.movementKeys.usageController.addProhibitor('automove')
    return super.automove(config).then((response) => {
      this.movementKeys.usageController.removeProhibitor('automove')
      return response
    })
  }
}