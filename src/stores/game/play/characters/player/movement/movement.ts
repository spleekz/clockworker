import { ExpandedDirection } from 'project-utility-types'

import { getReversedPrimitiveDirection } from 'stores/game/lib/movement'
import { GameSettings } from 'stores/game/play/settings/settings'
import { KeyboardStore } from 'stores/keyboard.store'

import {
  AutomoveDeltaX,
  AutomoveDeltaY,
  AutomoveFromTo,
  CharacterMovement,
  CharacterMovementConfig,
  MovementRegulators,
  MovementTypes,
} from '../../movement'
import { PlayerCharacterMovementKeys } from './keys'

export type PlayerCharacterMovementTypeName = 'walk'
export const playerCharacterMovementTypes: MovementTypes<PlayerCharacterMovementTypeName> = {
  walk: {
    step: 1.8,
    framesPerStep: 11,
  },
}

export type PlayerCharacterMovementRegulatorName = 'sprint'
export const playerCharacterMovementRegulators: MovementRegulators<PlayerCharacterMovementRegulatorName> =
  {
    sprint: { stepMultiplier: 1.88, framesPerStepMultiplier: 0.72 },
  }

export const playerCharacterInitialMovementType: PlayerCharacterMovementTypeName = 'walk'

type PlayerCharacterMovementConfig = CharacterMovementConfig<
  PlayerCharacterMovementTypeName,
  PlayerCharacterMovementRegulatorName
> & { settings: GameSettings }

export class PlayerCharacterMovement extends CharacterMovement<
  PlayerCharacterMovementTypeName,
  PlayerCharacterMovementRegulatorName
> {
  private settings: GameSettings

  keys: PlayerCharacterMovementKeys

  constructor(config: PlayerCharacterMovementConfig) {
    const { position, animationController, movementTypes, regulators, initialMovementType, settings } =
      config

    super({
      position,
      animationController,
      movementTypes,
      regulators,
      initialMovementType,
    })
    this.settings = settings

    // клавиши управления
    this.keys = new PlayerCharacterMovementKeys({ settings: this.settings })
  }

  //! обработка клавиш управления
  handleMovementKeys = (keyboard: KeyboardStore): void => {
    if (!this.keys.prohibitorsController.isProhibited) {
      const prevPressedControllersLength = this.keys.pressedControllers.length

      this.keys.setPressedKeys(keyboard.pressedKeysArray)

      // остановить движение только в момент, когда была отпущена последняя клавиша движения
      if (this.keys.pressedControllers.length === 0 && prevPressedControllersLength > 0) {
        this.stopMove()
      } else {
        if (this.keys.isControllerPressed) {
          // проверка на нажатие регуляторов
          if (this.keys.isRegulatorKeysPressed) {
            if (this.keys.isSprintKeyPressed) {
              this.setCurrentMovementRegulator('sprint')
            }
          } else {
            this.setCurrentMovementRegulator(null)
          }

          const getMovementDirection = (): ExpandedDirection | null => {
            var movementDirection: ExpandedDirection | null = null

            // убираем направления, компенсирующие друг друга (пример: вверх-вниз)
            const filteredPressedMovementDirections = this.keys.pressedDirections.filter(
              (pressedDirection) => {
                return this.keys.pressedDirections.every(
                  (d) => d !== getReversedPrimitiveDirection(pressedDirection),
                )
              },
            )

            // если длина массива 0, значит, все направления скомпенсировали друг друга - персонаж стоит на месте
            if (filteredPressedMovementDirections.length) {
              movementDirection = filteredPressedMovementDirections
                // сортируем, чтобы названия направлений получались в едином формате
                .sort((_, b) => (b === 'down' || b === 'up' ? 1 : -1))
                .join('') as ExpandedDirection
            }

            return movementDirection
          }

          const movementDirection = getMovementDirection()

          if (movementDirection) {
            if (!this.isMovementProhibited) {
              this.animationController.resume()
              this.moveWithAnimation({ direction: movementDirection })
            }
          }
        }
      }
    } else {
      if (
        this.keys.prohibitorsController.list.every(
          (p) => p !== 'automove' && p !== 'pause' && p !== 'textbox',
        )
      ) {
        // когда клавиши заблокированы автомувом - анимация продолжается
        // всё, кроме паузы и открытого текстбокса полностью останавливает анимацию
        this.animationController.stop()
      } else if (this.keys.prohibitorsController.list.some((p) => p === 'pause' || p === 'textbox')) {
        // когда игра на паузе или открыт текстбокс - анимация замирает
        this.animationController.pause()
      }
    }
  }

  //! автомув
  automove(config: AutomoveFromTo): Promise<boolean>
  automove(config: AutomoveDeltaX): Promise<boolean>
  automove(config: AutomoveDeltaY): Promise<boolean>
  override automove(config: any): Promise<boolean> {
    this.keys.prohibitorsController.add('automove')
    return super.automove(config).then((response) => {
      this.keys.prohibitorsController.remove('automove')
      return response
    })
  }
}
