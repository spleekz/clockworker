import { makeAutoObservable } from 'mobx'

import { ExpandedMovementDirection, PrimitiveMovementDirection, XY } from 'project-utility-types'

import { Position } from 'stores/entities/position'
import { KeyboardStore } from 'stores/keyboard.store'

import { areEquivalent } from 'lib/are-equivalent'
import { last } from 'lib/arrays'

import {
  GameSettings,
  GameSettingsMovementControls,
  MovementControllersKeys,
  MovementRegulatorsKeys,
} from '../../settings/settings'
import { CharacterAnimation, ViewDirections } from '../animation'

type MovementConfig = {
  stepSize: number
  framesPerStep: number
}

type MovementTypeName = 'walk' | 'entering'
type MovementTypes = Record<MovementTypeName, MovementConfig>

type MovementConfigParametersNames = {
  type: MovementTypeName
  regulator: MovementRegulatorName | null
}
type MovementConfigParameters = {
  type: MovementConfig
  regulator: MovementRegulator | null
}

type MovementRegulatorName = 'sprint'
type MovementRegulator = {
  stepSizeMultiplier: number
  framesPerStepMultiplier: number
}
type MovementRegulators = Record<MovementRegulatorName, MovementRegulator>

type MoveConfig = { direction: ExpandedMovementDirection }

type AutomoveFromTo = { from?: XY; to: XY }
type AutomoveDeltaX = { deltaX: number }
type AutomoveDeltaY = { deltaY: number }
type AutomoveConfig = AutomoveFromTo | AutomoveDeltaX | AutomoveDeltaY

type Automove = {
  (config: AutomoveFromTo): Promise<boolean>
  (config: AutomoveDeltaX): Promise<boolean>
  (config: AutomoveDeltaY): Promise<boolean>
}

const isAutomoveFromToConfig = (config: AutomoveConfig): config is AutomoveFromTo => {
  return (config as AutomoveFromTo).to !== undefined
}
const isAutomoveDeltaXConfig = (config: AutomoveConfig): config is AutomoveDeltaX => {
  return (config as AutomoveDeltaX).deltaX !== undefined
}
const isAutomoveDeltaYConfig = (config: AutomoveConfig): config is AutomoveDeltaY => {
  return (config as AutomoveDeltaY).deltaY !== undefined
}

type PlayerCharacterMovementConfig = {
  position: Position
  settings: GameSettings
  animation: CharacterAnimation
}

export class PlayerCharacterMovement {
  private position: Position
  private settings: GameSettings
  private animation: CharacterAnimation

  constructor(config: PlayerCharacterMovementConfig) {
    this.position = config.position
    this.settings = config.settings
    this.animation = config.animation

    makeAutoObservable(this)
  }

  //@Позиция
  //!Позиция на следующий шаг
  getPositionOnNextStep = (): XY => {
    const { stepSize } = this.currentMovementConfig

    //Длина шага по диагонали должна быть равна длине шага по прямой
    const diagonalStepSize = Math.sqrt(Math.pow(stepSize, 2) / 2)

    const { x, y } = this.position

    if (this.movementDirection === 'down') {
      return { x, y: y + stepSize }
    } else if (this.movementDirection === 'downright') {
      return { x: x + diagonalStepSize, y: y + diagonalStepSize }
    } else if (this.movementDirection === 'right') {
      return { x: x + stepSize, y }
    } else if (this.movementDirection === 'upright') {
      return { x: x + diagonalStepSize, y: y - diagonalStepSize }
    } else if (this.movementDirection === 'up') {
      return { x, y: y - stepSize }
    } else if (this.movementDirection === 'upleft') {
      return { x: x - diagonalStepSize, y: y - diagonalStepSize }
    } else if (this.movementDirection === 'left') {
      return { x: x - stepSize, y }
    } else {
      //downleft
      return { x: x - diagonalStepSize, y: y + diagonalStepSize }
    }
  }

  //!Направление движения
  getMovementDirection = (start: XY, end: XY): ExpandedMovementDirection => {
    var direction: ExpandedMovementDirection = '' as ExpandedMovementDirection
    if (start.y < end.y) {
      direction += 'down'
    } else if (start.y > end.y) {
      direction += 'up'
    }

    if (start.x < end.x) {
      direction += 'right'
    } else if (start.x > end.x) {
      direction += 'left'
    }

    return direction as ExpandedMovementDirection
  }

  //Существует только в момент движения персонажа
  movementDirection: ExpandedMovementDirection | null = null
  setMovementDirection = (direction: ExpandedMovementDirection | null): void => {
    //Установка направления взгляда
    if (direction) {
      const newViewDirection: ViewDirections = direction.includes('right')
        ? ViewDirections.RIGHT
        : direction.includes('left')
        ? ViewDirections.LEFT
        : direction === 'down'
        ? ViewDirections.DOWN
        : ViewDirections.UP

      //Чтобы при смене напрвления взгляда сразу была анимация шага
      if (!this.movementDirection || newViewDirection !== this.animation.viewDirection) {
        this.animation.setMovementFramesCount(0)
        this.animation.setMovementLoopIndex(1)
      }

      this.animation.setViewDirection(newViewDirection)
    }
    this.movementDirection = direction
  }

  getReversedPrimitiveDirection = (
    direction: PrimitiveMovementDirection,
  ): PrimitiveMovementDirection => {
    if (direction === 'down') {
      return 'up'
    } else if (direction === 'right') {
      return 'left'
    } else if (direction === 'up') {
      return 'down'
    } else {
      return 'right'
    }
  }

  //^@Позиция

  //@Обработка движения
  //!Конфиг движения
  //если null => герой стоит на месте
  get movementTypes(): MovementTypes {
    return {
      walk: {
        stepSize: 1.8,
        framesPerStep: 11,
      },
      entering: {
        stepSize: 0.45,
        framesPerStep: 11,
      },
    }
  }
  get movementRegulators(): MovementRegulators {
    return { sprint: { stepSizeMultiplier: 1.88, framesPerStepMultiplier: 0.72 } }
  }

  currentMovementConfigParametersNames: MovementConfigParametersNames = {
    type: 'walk',
    regulator: null,
  }
  setCurrentMovementType = (typeName: MovementTypeName): void => {
    this.currentMovementConfigParametersNames.type = typeName
  }
  setCurrentMovementRegulator = (regulatorName: MovementRegulatorName | null): void => {
    this.currentMovementConfigParametersNames.regulator = regulatorName
  }
  get currentMovementConfigParameters(): MovementConfigParameters {
    const type: MovementConfig = this.movementTypes[this.currentMovementConfigParametersNames.type]

    const regulator: MovementRegulator | null = this.currentMovementConfigParametersNames.regulator
      ? this.movementRegulators[this.currentMovementConfigParametersNames.regulator]
      : null

    return { type, regulator }
  }

  get currentMovementConfig(): MovementConfig {
    const { type, regulator } = this.currentMovementConfigParameters
    const stepSizeMultiplier = regulator ? regulator.stepSizeMultiplier : 1
    const framesPerStepMultiplier = regulator ? regulator.framesPerStepMultiplier : 1

    const stepSize = type.stepSize * stepSizeMultiplier
    const framesPerStep = Math.round(type.framesPerStep * framesPerStepMultiplier)

    return { stepSize, framesPerStep }
  }

  isMoving = false
  setIsMoving = (value: boolean): void => {
    this.isMoving = value
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

  get isSprintKeyPressed(): boolean {
    return this.lastPressedMovementRegulator === this.movementRegulatorsKeys.sprint
  }
  //^@Клавиши управления

  //!Движение
  //Отвечает за анимацию движения и за перемещение персонажа в валидную позицию
  move = ({ direction }: MoveConfig): void => {
    this.setMovementDirection(direction)

    if (this.isSprintKeyPressed) {
      this.setCurrentMovementRegulator('sprint')
    } else {
      this.setCurrentMovementRegulator(null)
    }

    if (this.currentMovementConfig) {
      const positionOnNextStep = this.getPositionOnNextStep()
      this.position.setXY(positionOnNextStep.x, positionOnNextStep.y)

      //Обновление счётчика кадров и анимации ходьбы
      const { framesPerStep } = this.currentMovementConfig
      this.animation.increaseMovementFramesCount()
      if (this.animation.movementFramesCount >= framesPerStep) {
        this.animation.setMovementFramesCount(0)
        this.animation.increaseMovementLoopIndex()
      }
    }
  }

  //!Остановка
  stop = (): void => {
    this.setIsMoving(false)
    this.setMovementDirection(null)
    this.animation.setMovementFramesCount(0)
    this.animation.setMovementLoopIndex(0)
  }

  //!Обработка клавиш движения
  isHandleMovementKeys = true
  setIsHandleMovementKeys = (value: boolean): void => {
    this.isHandleMovementKeys = value
  }
  handleMovementKeys = (keyboard: KeyboardStore): void => {
    if (this.isHandleMovementKeys) {
      this.setPressedKeys(keyboard.pressedKeysArray)

      if (this.isMovementControllerPressed) {
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

  //!Автомув
  isAutomoving = false
  setIsAutomoving = (value: boolean): void => {
    this.isAutomoving = value
  }

  isAutomovePaused = false
  pauseAutomove = (): void => {
    this.isAutomovePaused = true
  }
  resumeAutomove = (): void => {
    this.isAutomovePaused = false
  }

  //Перемещает персонажа из стартовой позиции в конечную
  automove: Automove = (config) => {
    return new Promise((resolve) => {
      const start: XY = { x: this.position.x, y: this.position.y }
      const end: XY = { x: this.position.x, y: this.position.y }

      if (isAutomoveFromToConfig(config)) {
        const { from, to } = config
        if (from) {
          start.x = from.x
          start.y = from.y
        }
        end.x = to.x
        end.y = to.y
      } else if (isAutomoveDeltaXConfig(config)) {
        const { deltaX } = config
        end.x = start.x + deltaX
      } else if (isAutomoveDeltaYConfig(config)) {
        const { deltaY } = config
        end.y = start.y + deltaY
      }

      //Если движение НЕ по прямой
      if ((start.x !== end.x && start.y !== end.y) || areEquivalent(start, end)) {
        return resolve(false)
      }

      const startAutoMoving = (): void => {
        this.setIsAutomoving(true)
        //Запрещаем во время автомува управлять персонажем клавишами
        this.setIsHandleMovementKeys(false)
      }
      const stopAutomoving = (): void => {
        this.stop()
        this.setIsAutomoving(false)
        this.setIsHandleMovementKeys(true)
      }

      startAutoMoving()

      //Перемещаем героя в стартовую позицию
      this.position.setXY(start.x, start.y)

      const movementDirection = this.getMovementDirection(start, end)

      //Нужна, чтобы не вызывать move(), после того, как встали на конечную позицию
      var shouldMove = true

      //Двигаемся в текущем направлении, пока не дойдём до конечной позиции
      const automoveInDirection = (): void => {
        if (!areEquivalent(this.position.value, end)) {
          if (!this.isAutomovePaused) {
            //Остановка на конечной позиции, если следующим шагом уходим дальше
            const setPositionToEndAndStopAutomoving = (x: number, y: number): void => {
              this.position.setXY(x, y)
              shouldMove = false
            }

            const positionOnNextStep = this.getPositionOnNextStep()

            if (movementDirection === 'down') {
              if (positionOnNextStep.y > end.y) {
                setPositionToEndAndStopAutomoving(this.position.x, end.y)
              }
            } else if (movementDirection === 'right') {
              if (positionOnNextStep.x > end.x) {
                setPositionToEndAndStopAutomoving(end.x, this.position.y)
              }
            } else if (movementDirection === 'up') {
              if (positionOnNextStep.y < end.y) {
                setPositionToEndAndStopAutomoving(this.position.x, end.y)
              }
            } else if (movementDirection === 'left') {
              if (positionOnNextStep.x < end.x) {
                setPositionToEndAndStopAutomoving(end.x, this.position.y)
              }
            }
            if (shouldMove) {
              this.move({ direction: movementDirection })
            }
          }

          window.requestAnimationFrame(automoveInDirection)
        } else {
          stopAutomoving()
          resolve(true)
        }
      }
      automoveInDirection()
    })
  }
  //^@Обработка движения
}
