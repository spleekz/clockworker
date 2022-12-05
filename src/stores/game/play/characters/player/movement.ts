import { ExpandedMovementDirection, PrimitiveMovementDirection } from 'project-utility-types'

import { UsageController } from 'stores/entities/usage-controller'
import { KeyboardStore } from 'stores/keyboard.store'

import { last } from 'lib/arrays'

import {
  GameSettings,
  GameSettingsMovementControls,
  MovementControllersKeys,
  MovementRegulatorsKeys,
} from '../../settings/settings'
import {
  AutomoveDeltaX,
  AutomoveDeltaY,
  AutomoveFromTo,
  CharacterMovement,
  CharacterMovementConfig,
} from '../movement'

type PlayerCharacterMovementConfig = CharacterMovementConfig & { settings: GameSettings }
export class PlayerCharacterMovement extends CharacterMovement {
  private settings: GameSettings

  constructor(config: PlayerCharacterMovementConfig) {
    super({ animation: config.animation, position: config.position })
    this.settings = config.settings
  }

  //@Клавиши управления
  pressedKeys: Array<string> = []
  setPressedKeys = (keys: Array<string>): void => {
    this.pressedKeys = keys
  }

  get movementControls(): GameSettingsMovementControls {
    return this.settings.current.controls.movement
  }

  //!Контроллеры
  get movementControllersKeys(): MovementControllersKeys {
    return this.movementControls.controllers.value
  }
  isMovementControllerKey = (key: string): boolean => {
    return Object.values(this.movementControllersKeys).some((controller) => key === controller)
  }

  get pressedMovementControllers(): Array<string> {
    return this.pressedKeys.slice().reverse().filter(this.isMovementControllerKey)
  }
  get pressedMovementDirections(): Array<PrimitiveMovementDirection> {
    return this.pressedMovementControllers.map((controller) =>
      controller === this.movementControllersKeys.down
        ? 'down'
        : controller === this.movementControllersKeys.right
        ? 'right'
        : controller === this.movementControllersKeys.up
        ? 'up'
        : 'left',
    )
  }

  get isMovementControllerPressed(): boolean {
    return this.pressedMovementControllers.length !== 0
  }
  get isMoveDownControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllersKeys.down)
  }
  get isMoveRightControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllersKeys.right)
  }
  get isMoveUpControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllersKeys.up)
  }
  get isMoveLeftControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllersKeys.left)
  }

  //!Регуляторы
  get movementRegulatorsKeys(): MovementRegulatorsKeys {
    return this.movementControls.regulators.value
  }
  isMovementRegulatorKey = (key: string): boolean => {
    return Object.values(this.movementRegulatorsKeys).some((regulator) => key === regulator)
  }

  get pressedMovementRegulators(): Array<string> {
    return this.pressedKeys.filter(this.isMovementRegulatorKey)
  }
  get lastPressedMovementRegulator(): string {
    return last(this.pressedMovementRegulators)
  }
  get isMovementRegulatorsKeys(): boolean {
    return this.pressedMovementRegulators.length > 0
  }

  get isSprintKeyPressed(): boolean {
    return this.lastPressedMovementRegulator === this.movementRegulatorsKeys.sprint
  }

  //!Обработка клавиш управления
  movementKeysUsageController = new UsageController()

  handleMovementKeys = (keyboard: KeyboardStore): void => {
    if (!this.movementKeysUsageController.isProhibited) {
      this.setPressedKeys(keyboard.pressedKeysArray)
      if (this.isMovementControllerPressed) {
        //Проверка на нажатие регуляторов
        if (this.isMovementRegulatorsKeys) {
          if (this.isSprintKeyPressed) {
            this.setCurrentMovementRegulator('sprint')
          }
        } else {
          this.setCurrentMovementRegulator(null)
        }

        const getMovementDirection = (): ExpandedMovementDirection | null => {
          var movementDirection: ExpandedMovementDirection | null = null

          //Убираем направления, компенсирующие друг друга (пример: вверх-вниз)
          const filteredPressedMovementDirections = this.pressedMovementDirections.filter(
            (pressedDirection) => {
              return this.pressedMovementDirections.every(
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
  //^@Клавиши управления

  //!Автомув
  automove(config: AutomoveFromTo): Promise<boolean>
  automove(config: AutomoveDeltaX): Promise<boolean>
  automove(config: AutomoveDeltaY): Promise<boolean>
  override automove(config: any): Promise<boolean> {
    this.movementKeysUsageController.addProhibitor('automove')
    return super.automove(config).then((response) => {
      this.movementKeysUsageController.removeProhibitor('automove')
      return response
    })
  }
}
