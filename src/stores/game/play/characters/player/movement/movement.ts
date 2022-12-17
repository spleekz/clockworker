import { ExpandedMovementDirection } from 'project-utility-types'

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
    stepSize: 1.8,
    framesPerStep: 11,
  },
}

export type PlayerCharacterMovementRegulatorName = 'sprint'
export const playerCharacterMovementRegulators: MovementRegulators<PlayerCharacterMovementRegulatorName> =
  {
    sprint: { stepSizeMultiplier: 1.88, framesPerStepMultiplier: 0.72 },
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
    super({
      animationController: config.animationController,
      position: config.position,
      movementTypes: config.movementTypes,
      regulators: config.regulators,
      initialMovementType: config.initialMovementType,
    })
    this.settings = config.settings

    //Клавиши управления
    this.keys = new PlayerCharacterMovementKeys({ settings: this.settings })
  }

  //!Обработка клавиш управления
  handleMovementKeys = (keyboard: KeyboardStore): void => {
    if (!this.keys.usageController.isProhibited) {
      const prevPressedControllersLength = this.keys.pressedControllers.length

      this.keys.setPressedKeys(keyboard.pressedKeysArray)

      //Остановить движение только в момент, когда была отпущена последняя клавиша движения
      if (this.keys.pressedControllers.length === 0 && prevPressedControllersLength > 0) {
        this.stopMove()
      } else {
        if (this.keys.isControllerPressed) {
          //Проверка на нажатие регуляторов
          if (this.keys.isRegulatorKeysPressed) {
            if (this.keys.isSprintKeyPressed) {
              this.setCurrentMovementRegulator('sprint')
            }
          } else {
            this.setCurrentMovementRegulator(null)
          }

          const getMovementDirection = (): ExpandedMovementDirection | null => {
            var movementDirection: ExpandedMovementDirection | null = null

            //Убираем направления, компенсирующие друг друга (пример: вверх-вниз)
            const filteredPressedMovementDirections = this.keys.pressedDirections.filter(
              (pressedDirection) => {
                return this.keys.pressedDirections.every(
                  (d) => d !== getReversedPrimitiveDirection(pressedDirection),
                )
              },
            )

            //Если длина массива 0, значит, все направления скомпенсировали друг друга - персонаж стоит на месте
            if (filteredPressedMovementDirections.length) {
              movementDirection = filteredPressedMovementDirections
                //Сортируем, чтобы названия направлений получались в едином формате
                .sort((_, b) => (b === 'down' || b === 'up' ? 1 : -1))
                .join('') as ExpandedMovementDirection
            }

            return movementDirection
          }

          const movementDirection = getMovementDirection()

          if (movementDirection) {
            if (this.isAllowedToMove) {
              this.animationController.resume()
              this.moveWithAnimation({ direction: movementDirection })
            }
          }
        }
      }
    } else {
      if (
        this.keys.usageController.prohibitors.every(
          (p) => p !== 'automove' && p !== 'pause' && p !== 'textbox',
        )
      ) {
        //Когда клавиши заблокированы автомувом - анимация продолжается
        //Всё, кроме паузы и открытого текстбокса полностью останавливает анимацию
        this.animationController.stop()
      } else if (this.keys.usageController.prohibitors.some((p) => p === 'pause' || p === 'textbox')) {
        //Когда игра на паузе или открыт текстбокс - анимация замирает
        this.animationController.pause()
      }
    }
  }

  //!Автомув
  automove(config: AutomoveFromTo): Promise<boolean>
  automove(config: AutomoveDeltaX): Promise<boolean>
  automove(config: AutomoveDeltaY): Promise<boolean>
  override automove(config: any): Promise<boolean> {
    this.keys.usageController.addProhibitor('automove')
    return super.automove(config).then((response) => {
      this.keys.usageController.removeProhibitor('automove')
      return response
    })
  }
}
