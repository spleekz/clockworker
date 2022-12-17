import { ExpandedDirection, XY } from 'project-utility-types'

import { AnimationController } from 'stores/entities/animation-controller'
import { Position } from 'stores/entities/position'
import { UsageController } from 'stores/entities/usage-controller'
import {
  convertExpandedDirectionToPrimitiveDirection,
  getMovementDirection,
} from 'stores/game/lib/movement'

import { areEquivalent } from 'lib/are-equivalent'
import { capitalizeFirstSymbol } from 'lib/strings'

import { CharacterMovementAnimationName } from './animation'

type MovementConfig = {
  step: number
  framesPerStep: number
}
type MovementRegulator = {
  stepMultiplier: number
  framesPerStepMultiplier: number
}

type MovementConfigParametersNames<MovementTypeName extends string, RegulatorName extends string> = {
  type: MovementTypeName
  regulator: RegulatorName | null
}
type MovementConfigParameters = {
  type: MovementConfig
  regulator: MovementRegulator | null
}

export type MovementTypes<MovementTypeName extends string> = Record<MovementTypeName, MovementConfig>
export type MovementRegulators<RegulatorName extends string> = Record<RegulatorName, MovementRegulator>

type MoveConfig = { direction: ExpandedDirection }

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

export type CharacterMovementConfig<MovementTypeName extends string, RegulatorName extends string> = {
  position: Position
  animationController: AnimationController<any>
  movementTypes: MovementTypes<MovementTypeName>
  regulators: MovementRegulators<RegulatorName>
  initialMovementType: MovementTypeName
}
export class CharacterMovement<MovementTypeName extends string, RegulatorName extends string> {
  private position: Position
  protected animationController: AnimationController<any>

  movementTypes: MovementTypes<MovementTypeName>
  regulators: MovementRegulators<RegulatorName>

  currentMovementConfigParametersNames: MovementConfigParametersNames<MovementTypeName, RegulatorName>

  constructor(config: CharacterMovementConfig<MovementTypeName, RegulatorName>) {
    this.position = config.position
    this.animationController = config.animationController

    this.movementTypes = config.movementTypes
    this.regulators = config.regulators

    this.currentMovementConfigParametersNames = {
      type: config.initialMovementType,
      regulator: null,
    }
  }

  //@Позиция
  //!Позиция на следующий шаг
  getPositionOnNextStep = (): XY => {
    const { step } = this.currentMovementConfig

    //Длина шага по диагонали должна быть равна длине шага по прямой
    const diagonalStep = Math.sqrt(Math.pow(step, 2) / 2)

    const { x, y } = this.position

    if (this.direction === 'down') {
      return { x, y: y + step }
    } else if (this.direction === 'downright') {
      return { x: x + diagonalStep, y: y + diagonalStep }
    } else if (this.direction === 'right') {
      return { x: x + step, y }
    } else if (this.direction === 'upright') {
      return { x: x + diagonalStep, y: y - diagonalStep }
    } else if (this.direction === 'up') {
      return { x, y: y - step }
    } else if (this.direction === 'upleft') {
      return { x: x - diagonalStep, y: y - diagonalStep }
    } else if (this.direction === 'left') {
      return { x: x - step, y }
    } else {
      //downleft
      return { x: x - diagonalStep, y: y + diagonalStep }
    }
  }

  //!Направление движения
  //Существует только в момент движения персонажа
  direction: ExpandedDirection | null = null
  setDirection = (direction: ExpandedDirection | null): void => {
    this.direction = direction
  }
  //^@Позиция

  //@Обработка движения
  //!Конфиг движения
  setCurrentMovementType = (typeName: MovementTypeName): void => {
    this.currentMovementConfigParametersNames.type = typeName
  }
  setCurrentMovementRegulator = (regulatorName: RegulatorName | null): void => {
    this.currentMovementConfigParametersNames.regulator = regulatorName
  }
  get currentMovementConfigParameters(): MovementConfigParameters {
    const type: MovementConfig = this.movementTypes[this.currentMovementConfigParametersNames.type]

    const regulator: MovementRegulator | null = this.currentMovementConfigParametersNames.regulator
      ? this.regulators[this.currentMovementConfigParametersNames.regulator]
      : null

    return { type, regulator }
  }

  get currentMovementConfig(): MovementConfig {
    const { type, regulator } = this.currentMovementConfigParameters
    const stepMultiplier = regulator ? regulator.stepMultiplier : 1
    const framesPerStepMultiplier = regulator ? regulator.framesPerStepMultiplier : 1

    const step = type.step * stepMultiplier
    const framesPerStep = Math.round(type.framesPerStep * framesPerStepMultiplier)

    return { step, framesPerStep }
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

  move = ({ direction }: MoveConfig): void => {
    this.setDirection(direction)

    if (this.currentMovementConfig) {
      const positionOnNextStep = this.getPositionOnNextStep()
      this.position.setXY(positionOnNextStep.x, positionOnNextStep.y)
    }
  }

  moveWithAnimation = (moveConfig: MoveConfig): void => {
    this.move(moveConfig)

    if (this.direction) {
      const animationName: CharacterMovementAnimationName = ('walk' +
        capitalizeFirstSymbol(
          convertExpandedDirectionToPrimitiveDirection(this.direction),
        )) as CharacterMovementAnimationName

      //Обновляем скорость анимации в соответствие с текущим конфигом движения
      if (
        this.currentMovementConfig.framesPerStep !== this.animationController.current.framesPerSprite
      ) {
        this.animationController.current.setFramesPerSprite(this.currentMovementConfig.framesPerStep)
      }

      this.animationController.run(animationName, {
        framesPerSprite: this.currentMovementConfig.framesPerStep,
      })
    }
  }

  //!Остановка
  stopMove = (): void => {
    this.setIsMoving(false)
    this.setDirection(null)
    this.animationController.stop()
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
        this.stopMove()
        this.setIsAutomoving(false)
      }

      startAutoMoving()

      //Перемещаем героя в стартовую позицию
      this.position.setXY(start.x, start.y)

      const direction = getMovementDirection(start, end)

      //Нужна, чтобы не вызывать move(), после того, как встали на конечную позицию
      var shouldMove = true

      //Двигаемся в текущем направлении, пока не дойдём до конечной позиции
      const automoveInDirection = (): void => {
        if (this.isStuck) {
          this.setIsAutomoving(false)
        }

        if (this.isAutomoving && !areEquivalent(this.position.value, end)) {
          //Остановка на конечной позиции, если следующим шагом уходим дальше
          const setPositionToEndAndStopAutomoving = (x: number, y: number): void => {
            this.position.setXY(x, y)
            shouldMove = false
          }

          const positionOnNextStep = this.getPositionOnNextStep()

          if (direction === 'down') {
            if (positionOnNextStep.y > end.y) {
              setPositionToEndAndStopAutomoving(this.position.x, end.y)
            }
          } else if (direction === 'right') {
            if (positionOnNextStep.x > end.x) {
              setPositionToEndAndStopAutomoving(end.x, this.position.y)
            }
          } else if (direction === 'up') {
            if (positionOnNextStep.y < end.y) {
              setPositionToEndAndStopAutomoving(this.position.x, end.y)
            }
          } else if (direction === 'left') {
            if (positionOnNextStep.x < end.x) {
              setPositionToEndAndStopAutomoving(end.x, this.position.y)
            }
          }

          if (shouldMove) {
            if (this.isAllowedToMove) {
              this.animationController.resume()
              this.moveWithAnimation({ direction })
            } else {
              if (
                this.movementUsageController.prohibitors.every((p) => p !== 'pause' && p !== 'textbox')
              ) {
                //Всё, кроме паузы и текстбокса останавливает анимацию
                this.animationController.stop()
              } else {
                //Когда игра на паузе или открыт текстбокс - анимация замирает
                this.animationController.pause()
              }
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
