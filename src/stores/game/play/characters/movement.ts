import { ExpandedMovementDirection, XY } from 'project-utility-types'

import { Position } from 'stores/entities/position'
import { UsageController } from 'stores/entities/usage-controller'
import { getMovementDirection } from 'stores/game/lib/movement'

import { areEquivalent } from 'lib/are-equivalent'

import { CharacterAnimation, ViewDirections } from './animation'

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

export type AutomoveFromTo = { from?: XY; to: XY }
export type AutomoveDeltaX = { deltaX: number }
export type AutomoveDeltaY = { deltaY: number }

const isAutomoveFromToConfig = (config: any): config is AutomoveFromTo => {
  return (config as AutomoveFromTo).to !== undefined
}
const isAutomoveDeltaXConfig = (config: any): config is AutomoveDeltaX => {
  return (config as AutomoveDeltaX).deltaX !== undefined
}
const isAutomoveDeltaYConfig = (config: any): config is AutomoveDeltaY => {
  return (config as AutomoveDeltaY).deltaY !== undefined
}

export type CharacterMovementConfig = {
  position: Position
  animation: CharacterAnimation
}
export class CharacterMovement {
  private position: Position
  private animation: CharacterAnimation

  constructor(config: CharacterMovementConfig) {
    this.position = config.position
    this.animation = config.animation
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

  //!Движение
  movementUsageController = new UsageController()
  get isAllowedToMove(): boolean {
    return this.movementUsageController.prohibitors.length === 0
  }

  isMoving = false
  setIsMoving = (value: boolean): void => {
    this.isMoving = value
  }

  isStuck = false
  setIsStuck = (value: boolean): void => {
    this.isStuck = value
  }

  //Отвечает за анимацию движения и за перемещение персонажа
  move = ({ direction }: MoveConfig): void => {
    if (this.isAllowedToMove) {
      this.setMovementDirection(direction)

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
  }

  //!Остановка
  stop = (): void => {
    this.setIsMoving(false)
    this.setMovementDirection(null)
    this.animation.setMovementFramesCount(0)
    this.animation.setMovementLoopIndex(0)
  }

  //!Автомув
  isAutomoving = false
  setIsAutomoving = (value: boolean): void => {
    this.isAutomoving = value
  }

  //Перемещает персонажа из стартовой позиции в конечную
  automove(config: AutomoveFromTo): Promise<boolean>
  automove(config: AutomoveDeltaX): Promise<boolean>
  automove(config: AutomoveDeltaY): Promise<boolean>
  automove(config: any): Promise<boolean> {
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
      }
      const stopAutomoving = (): void => {
        this.stop()
        this.setIsAutomoving(false)
      }

      startAutoMoving()

      //Перемещаем героя в стартовую позицию
      this.position.setXY(start.x, start.y)

      const movementDirection = getMovementDirection(start, end)

      //Нужна, чтобы не вызывать move(), после того, как встали на конечную позицию
      var shouldMove = true

      //Двигаемся в текущем направлении, пока не дойдём до конечной позиции
      const automoveInDirection = (): void => {
        if (this.isStuck) {
          this.isAutomoving = false
        }

        if (this.isAutomoving && !areEquivalent(this.position.value, end)) {
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
