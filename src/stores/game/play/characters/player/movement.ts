import { makeAutoObservable } from 'mobx'

import { ExpandedMovementDirection, PrimitiveMovementDirection, Size } from 'game-utility-types'

import { Sprite } from 'stores/entities/sprite'
import { KeyboardStore } from 'stores/keyboard.store'

import { areSame } from 'lib/are-same'
import { last } from 'lib/arrays'
import { XY } from 'lib/coords'

import { Position } from '../../../../entities/position'
import {
  CurrentGameSettings,
  MovementControllersKeys,
  MovementKeys,
  MovementRegulatorsKeys,
} from '../../settings/current-settings'
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

type MoveFunctionConfig = { direction: ExpandedMovementDirection }

type AutomoveConfig = { start: XY; end: XY }

type PlayerMovementConfig = {
  position: Position
  mapSize: Size
  settings: CurrentGameSettings
  sprite: Sprite
  animation: CharacterAnimation
}

export class PlayerMovement {
  private position: Position
  private mapSize: Size
  private settings: CurrentGameSettings
  private sprite: Sprite
  private animation: CharacterAnimation

  constructor(config: PlayerMovementConfig) {
    this.position = config.position
    this.mapSize = config.mapSize
    this.settings = config.settings
    this.sprite = config.sprite
    this.animation = config.animation

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //@Позиция
  //!Позиция персонажа
  //!Позиция на следующий шаг
  getPositionOnNextStep(): XY {
    const { stepSize } = this.currentMovementConfig

    //Длина шага по диагонали должна быть равна длине шага по прямой
    const diagonalStepSize = Math.sqrt(Math.pow(stepSize, 2) / 2)

    const { x, y } = this.position

    //Если герой упирается в границы карты
    const isRestedInDownMapBorder = y === this.maxYCoordinate
    const isRestedInRightMapBorder = x === this.maxXCoordinate
    const isRestedInTopMapBorder = y === 0
    const isRestedInLeftMapBorder = x === 0

    if (this.movementDirection === 'down') {
      return { x, y: y + stepSize }
    } else if (this.movementDirection === 'downright') {
      return {
        x: isRestedInRightMapBorder ? x : x + diagonalStepSize,
        y: isRestedInDownMapBorder ? y : y + diagonalStepSize,
      }
    } else if (this.movementDirection === 'right') {
      return { x: x + stepSize, y }
    } else if (this.movementDirection === 'upright') {
      return {
        x: isRestedInRightMapBorder ? x : x + diagonalStepSize,
        y: isRestedInTopMapBorder ? y : y - diagonalStepSize,
      }
    } else if (this.movementDirection === 'up') {
      return { x, y: y - stepSize }
    } else if (this.movementDirection === 'upleft') {
      return {
        x: isRestedInLeftMapBorder ? x : x - diagonalStepSize,
        y: isRestedInTopMapBorder ? y : y - diagonalStepSize,
      }
    } else if (this.movementDirection === 'left') {
      return { x: x - stepSize, y }
    } else {
      //downleft
      return {
        x: isRestedInLeftMapBorder ? x : x - diagonalStepSize,
        y: isRestedInDownMapBorder ? y : y + diagonalStepSize,
      }
    }
  }

  //!Допустимая позиция
  //С учётом размера спрайта
  isOutOfDownMapBorder(position: XY): boolean {
    return position.y > this.maxYCoordinate
  }
  isOutOfRightMapBorder(position: XY): boolean {
    return position.x > this.maxXCoordinate
  }
  isOutOfTopMapBorder(position: XY): boolean {
    return position.y < 0
  }
  isOutOfLeftMapBorder(position: XY): boolean {
    return position.x < 0
  }

  isAllowedPosition(position: XY): boolean {
    return !(
      this.isOutOfDownMapBorder(position) ||
      this.isOutOfRightMapBorder(position) ||
      this.isOutOfTopMapBorder(position) ||
      this.isOutOfLeftMapBorder(position)
    )
  }

  //!Установка позиции к краям карты
  get maxXCoordinate(): number {
    return this.mapSize.width - this.sprite.scaledWidth
  }
  get maxYCoordinate(): number {
    return this.mapSize.height - this.sprite.scaledHeight
  }

  setPositionToDownMapBorder(x?: number): void {
    this.position.setXY(x ?? this.position.x, this.maxYCoordinate)
  }
  setPositionToRightMapBorder(y?: number): void {
    this.position.setXY(this.maxXCoordinate, y ?? this.position.y)
  }
  setPositionToTopMapBorder(x?: number): void {
    this.position.setXY(x ?? this.position.x, 0)
  }
  setPositionToLeftMapBorder(y?: number): void {
    this.position.setXY(0, y ?? this.position.y)
  }

  //!Прятание героя за границы
  hideInDownMapBorder(x?: number): void {
    this.position.setXY(x ?? this.position.x, this.mapSize.height)
  }
  hideInRightMapBorder(y?: number): void {
    this.position.setXY(this.mapSize.width, y ?? this.position.y)
  }
  hideInTopMapBorder(x?: number): void {
    this.position.setXY(x ?? this.position.x, -this.sprite.scaledHeight)
  }
  hideInLeftMapBorder(y?: number): void {
    this.position.setXY(-this.sprite.scaledWidth, y ?? this.position.y)
  }

  //!Направление движения
  //Существует только в момент движения персонажа
  movementDirection: ExpandedMovementDirection | null = null
  setMovementDirection(direction: ExpandedMovementDirection | null): void {
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

  getReversedPrimitiveDirection(direction: PrimitiveMovementDirection): PrimitiveMovementDirection {
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
  setCurrentMovementType(typeName: MovementTypeName): void {
    this.currentMovementConfigParametersNames.type = typeName
  }
  setCurrentMovementRegulator(regulatorName: MovementRegulatorName | null): void {
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
  setIsMoving(value: boolean): void {
    this.isMoving = value
  }

  //@Клавиши управления
  pressedKeys: Array<string> = []
  setPressedKeys(keys: Array<string>): void {
    this.pressedKeys = keys
  }

  get movementKeys(): MovementKeys {
    return this.settings.movement.keys
  }

  //!Контроллеры
  get movementControllersKeys(): MovementControllersKeys {
    return this.movementKeys.controllers
  }
  isMovementControllerKey(key: string): boolean {
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
    return this.movementKeys.regulators
  }
  isMovementRegulatorKey(key: string): boolean {
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
  move({ direction }: MoveFunctionConfig): void {
    this.setMovementDirection(direction)

    if (this.isSprintKeyPressed) {
      this.setCurrentMovementRegulator('sprint')
    }

    if (this.currentMovementConfig) {
      const { framesPerStep } = this.currentMovementConfig

      const positionOnNextStep = this.getPositionOnNextStep()

      if (!this.isAutoMoving) {
        this.setCurrentMovementRegulator(this.isSprintKeyPressed ? 'sprint' : null)
        //Проверка, если следующим шагом персонаж выходит за границы
        if (!this.isAllowedPosition(positionOnNextStep)) {
          if (this.isOutOfDownMapBorder(positionOnNextStep)) {
            this.setPositionToDownMapBorder()
          } else if (this.isOutOfRightMapBorder(positionOnNextStep)) {
            this.setPositionToRightMapBorder()
          } else if (this.isOutOfTopMapBorder(positionOnNextStep)) {
            this.setPositionToTopMapBorder()
          } else if (this.isOutOfLeftMapBorder(positionOnNextStep)) {
            this.setPositionToLeftMapBorder()
          }
        } else {
          //Персонаж идёт дальше, только если не выходит за пределы карты
          this.position.setXY(positionOnNextStep.x, positionOnNextStep.y)
        }
      } else {
        //Автомувнутый персонаж может выходить за пределы карты
        this.position.setXY(positionOnNextStep.x, positionOnNextStep.y)
      }

      //Обновление счётчика кадров и анимации ходьбы
      this.animation.increaseMovementFramesCount()
      if (this.animation.movementFramesCount >= framesPerStep) {
        this.animation.setMovementFramesCount(0)
        this.animation.increaseMovementLoopIndex()
      }
    }
  }

  //!Остановка
  stop(): void {
    this.setIsMoving(false)
    this.setMovementDirection(null)
    this.animation.setMovementFramesCount(0)
    this.animation.setMovementLoopIndex(0)
  }

  //!Обработка клавиш движения
  handleMovementKeys(keyboard: KeyboardStore): void {
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

  //!Автомув
  isAutoMoving = false
  setIsAutoMoving(value: boolean): void {
    this.isAutoMoving = value
  }

  isAutomovePaused = false
  pauseAutomove(): void {
    this.isAutomovePaused = true
  }
  resumeAutomove(): void {
    this.isAutomovePaused = false
  }

  //Перемещает персонажа из стартовой позиции в конечную
  automove({ start, end }: AutomoveConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const startX = start.x
      const startY = start.y
      const endX = end.x
      const endY = end.y

      //Если движение по прямой
      if ((startX === endX || startY === endY) && !areSame(start, end)) {
        this.setIsAutoMoving(true)

        //Перемещаем героя в стартовую позицию
        this.position.setXY(startX, startY)

        var movementDirection: PrimitiveMovementDirection
        //Вычисляем направление движения
        if (endY > startY) {
          movementDirection = 'down'
        } else if (endX > startX) {
          movementDirection = 'right'
        } else if (endY < startY) {
          movementDirection = 'up'
        } else if (endX < startX) {
          movementDirection = 'left'
        }

        const stopAutoMoving = (): void => {
          this.stop()
          this.setIsAutoMoving(false)
        }

        //Нужна, чтобы не вызывать move(), после того, как встали на конечную позицию
        var shouldMove = true

        //Двигаемся в текущем направлении, пока не дойдём до конечной позиции
        const automoveInDirection = (): void => {
          if (!areSame(this.position, end)) {
            if (!this.isAutomovePaused) {
              //Остановка на конечной позиции, если следующим шагом уходим дальше
              const setPositionToEndAndStopAutoMoving = (x: number, y: number): void => {
                this.position.setXY(x, y)
                shouldMove = false
              }

              const positionOnNextStep = this.getPositionOnNextStep()

              if (movementDirection === 'down') {
                if (positionOnNextStep.y > end.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, end.y)
                }
              } else if (movementDirection === 'right') {
                if (positionOnNextStep.x > end.x) {
                  setPositionToEndAndStopAutoMoving(end.x, this.position.y)
                }
              } else if (movementDirection === 'up') {
                if (positionOnNextStep.y < end.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, end.y)
                }
              } else if (movementDirection === 'left') {
                if (positionOnNextStep.x < end.x) {
                  setPositionToEndAndStopAutoMoving(end.x, this.position.y)
                }
              }
              if (shouldMove) {
                this.move({ direction: movementDirection })
              }
            }

            window.requestAnimationFrame(automoveInDirection)
          } else {
            stopAutoMoving()
            resolve(true)
          }
        }
        automoveInDirection()
      } else {
        resolve(false)
      }
    })
  }
  //^@Обработка движения
}
