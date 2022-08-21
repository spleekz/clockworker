import { makeAutoObservable } from 'mobx'

import {
  ExpandedMovementDirection,
  MovementLoopState,
  Position,
  PrimitiveMovementDirection,
  ViewDirections,
} from 'game-utility-types'

import { Sprite } from 'stores/entities/sprite'
import { KeyboardStore } from 'stores/keyboard.store'
import {
  MovementControllers,
  MovementKeys,
  MovementRegulators,
  SettingsStore,
} from 'stores/settings.store'

import { areSame } from 'lib/are-same'
import { last } from 'lib/arrays'

import { Map } from '../map'

type PlayerMovementConfig = {
  keyboard: KeyboardStore
  map: Map
  settings: SettingsStore
  sprite: Sprite
}

type MovementStateName = 'idle' | 'walk' | 'sprint' | 'entering'
type MovementState = {
  stepSize: number
  framesPerStep: number
}
type MovementStates = {
  [P in MovementStateName]: MovementState
}

type AutoMoveConfig = {
  start: Position
  end: Position
  state: MovementState
}

export class PlayerMovement {
  private keyboard: KeyboardStore
  private map: Map
  private settings: SettingsStore
  private sprite: Sprite

  constructor(config: PlayerMovementConfig) {
    Object.assign(this, config)

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //@Позиция
  //!Позиция персонажа
  //Позиция верхнего левого угла спрайта
  position: Position = {
    x: 0,
    y: 0,
  }
  setPosition(x: number, y: number): void {
    this.position.x = x
    this.position.y = y
  }

  //!Позиция на следующий шаг
  getPositionOnNextStep(config?: { stepSize?: number }): Position {
    const { stepSize = this.currentMovementState.stepSize } = config ?? {}

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
  isOutOfDownMapBorder(position: Position): boolean {
    return position.y > this.maxYCoordinate
  }
  isOutOfRightMapBorder(position: Position): boolean {
    return position.x > this.maxXCoordinate
  }
  isOutOfTopMapBorder(position: Position): boolean {
    return position.y < 0
  }
  isOutOfLeftMapBorder(position: Position): boolean {
    return position.x < 0
  }

  isAllowedPosition(position: Position): boolean {
    return !(
      this.isOutOfDownMapBorder(position) ||
      this.isOutOfRightMapBorder(position) ||
      this.isOutOfTopMapBorder(position) ||
      this.isOutOfLeftMapBorder(position)
    )
  }

  //!Установка позиции к краям карты
  get maxXCoordinate(): number {
    return this.map.width - this.sprite.scaledWidth
  }
  get maxYCoordinate(): number {
    return this.map.height - this.sprite.scaledHeight
  }

  setPositionToDownMapBorder(x?: number): void {
    this.setPosition(x ?? this.position.x, this.maxYCoordinate)
  }
  setPositionToRightMapBorder(y?: number): void {
    this.setPosition(this.maxXCoordinate, y ?? this.position.y)
  }
  setPositionToTopMapBorder(x?: number): void {
    this.setPosition(x ?? this.position.x, 0)
  }
  setPositionToLeftMapBorder(y?: number): void {
    this.setPosition(0, y ?? this.position.y)
  }

  //!Прятание героя за границы
  hideInDownMapBorder(x?: number): void {
    this.setPosition(x ?? this.position.x, this.map.height)
  }
  hideInRightMapBorder(y?: number): void {
    this.setPosition(this.map.width, y ?? this.position.y)
  }
  hideInTopMapBorder(x?: number): void {
    this.setPosition(x ?? this.position.x, -this.sprite.scaledHeight)
  }
  hideInLeftMapBorder(y?: number): void {
    this.setPosition(-this.sprite.scaledWidth, y ?? this.position.y)
  }

  //!Направление взгляда
  viewDirection: ViewDirections = ViewDirections.DOWN
  setViewDirection(direction: ViewDirections): void {
    //Чтобы при смене напрвления взгляда сразу была анимация шага
    if (this.isMoving && this.viewDirection !== direction) {
      this.setMovementFramesCount(0)
      this.setMovementLoopIndex(1)
    }
    this.viewDirection = direction
  }

  //!Направление движения
  //Существует только в момент движения персонажа
  movementDirection: ExpandedMovementDirection | null = null
  setMovementDirection(direction: ExpandedMovementDirection | null): void {
    this.movementDirection = direction
    if (!this.movementDirection) {
      this.stop()
    }
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

  //@Анимация движения
  //!Цикл ходьбы
  movementLoop: Array<MovementLoopState> = [0, 1, 2, 3]
  movementLoopIndex = 0
  setMovementLoopIndex(index: MovementLoopState): void {
    this.movementLoopIndex = index
  }
  increaseMovementLoopIndex(): void {
    if (this.movementLoopIndex === this.movementLoop.length - 1) {
      this.setMovementLoopIndex(0)
    } else {
      this.movementLoopIndex += 1
    }
  }
  get movementLoopState(): MovementLoopState {
    return this.movementLoop[this.movementLoopIndex]
  }

  //!Счётчик кадров
  movementFramesCount = 0
  setMovementFramesCount(value: number): void {
    this.movementFramesCount = value
  }
  increaseMovementFramesCount(): void {
    this.movementFramesCount += 1
  }
  //^@Анимация движения

  //@Обработка движения
  //!Состояния движения
  get movementStates(): MovementStates {
    return {
      idle: {
        stepSize: 0,
        framesPerStep: 0,
      },
      walk: {
        stepSize: 1.8,
        framesPerStep: 11,
      },
      sprint: {
        stepSize: 3.4,
        framesPerStep: 8,
      },
      entering: {
        stepSize: 0.45,
        framesPerStep: 11,
      },
    }
  }

  currentMovementStateName: MovementStateName = 'idle'
  setCurrentMovementState(name: MovementStateName): void {
    this.currentMovementStateName = name
  }
  get currentMovementState(): MovementState {
    return this.movementStates[this.currentMovementStateName]
  }

  get isMoving(): boolean {
    return this.currentMovementStateName !== 'idle'
  }

  //@Клавиши управления
  get movementKeys(): MovementKeys {
    return this.settings.movementKeys
  }

  //!Контроллеры
  get movementControllers(): MovementControllers {
    return this.movementKeys.controllers
  }
  isMovementController(key: string): boolean {
    return Object.values(this.movementControllers).some((controller) => key === controller)
  }

  get pressedMovementControllers(): Array<string> {
    return Array.from(this.keyboard.pressedKeys).reverse().filter(this.isMovementController)
  }
  get pressedMovementDirections(): Array<PrimitiveMovementDirection> {
    return this.pressedMovementControllers.map((controller) =>
      controller === this.movementControllers.down
        ? 'down'
        : controller === this.movementControllers.right
        ? 'right'
        : controller === this.movementControllers.up
        ? 'up'
        : 'left',
    )
  }

  get isMovementControllerPressed(): boolean {
    return this.pressedMovementControllers.length !== 0
  }
  get isMoveDownControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllers.down)
  }
  get isMoveRightControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllers.right)
  }
  get isMoveUpControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllers.up)
  }
  get isMoveLeftControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllers.left)
  }

  //!Регуляторы
  get movementRegulators(): MovementRegulators {
    return this.movementKeys.regulators
  }
  isMovementRegulator(key: string): boolean {
    return Object.values(this.movementRegulators).some((regulator) => key === regulator)
  }

  get pressedMovementRegulators(): Array<string> {
    return this.keyboard.pressedKeysArray.filter(this.isMovementRegulator)
  }
  get lastPressedMovementRegulator(): string {
    return last(this.pressedMovementRegulators)
  }

  get isSprintKeyPressed(): boolean {
    return this.lastPressedMovementRegulator === this.movementRegulators.sprint
  }
  //^@Клавиши управления

  //!Движение
  //Отвечает за анимацию движения и за перемещение персонажа в валидную позицию
  move(state?: MovementState): void {
    const {
      stepSize = this.currentMovementState.stepSize,
      framesPerStep = this.currentMovementState.framesPerStep,
    } = state ?? {}

    const positionOnNextStep = this.getPositionOnNextStep({ stepSize })

    if (!this.isAutoMoving) {
      if (this.isSprintKeyPressed) {
        this.setCurrentMovementState('sprint')
      } else {
        this.setCurrentMovementState('walk')
      }
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
        this.setPosition(positionOnNextStep.x, positionOnNextStep.y)
      }
    } else {
      //Автомувнутый персонаж может выходить за пределы карты
      this.setPosition(positionOnNextStep.x, positionOnNextStep.y)
    }

    //Обновление счётчика кадров и анимации ходьбы
    this.increaseMovementFramesCount()
    if (this.movementFramesCount >= framesPerStep) {
      this.setMovementFramesCount(0)
      this.increaseMovementLoopIndex()
    }
  }

  //!Остановка
  stop(): void {
    this.setMovementFramesCount(0)
    this.setMovementLoopIndex(0)
    this.setCurrentMovementState('idle')
  }

  //!Обработка клавиш движения
  handleMovementKeys(): void {
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
            .reduce((acc, direction) => {
              return (acc += direction) as ExpandedMovementDirection
            }, '' as ExpandedMovementDirection)
        } else {
          movementDirection = null
        }

        return movementDirection
      }

      const movementDirection = getMovementDirection()

      this.setMovementDirection(movementDirection)

      if (this.movementDirection) {
        const viewDirection: ViewDirections = this.movementDirection.includes('right')
          ? ViewDirections.RIGHT
          : this.movementDirection.includes('left')
          ? ViewDirections.LEFT
          : this.movementDirection === 'down'
          ? ViewDirections.DOWN
          : ViewDirections.UP

        this.setViewDirection(viewDirection)
        this.move()
      }
    } else {
      this.setMovementDirection(null)
    }
  }

  //!Автомув персонажа
  isAutoMoving = false
  setIsAutoMoving(value: boolean): void {
    this.isAutoMoving = value
  }

  isAutoMovePaused = false
  pauseAutoMove(): void {
    this.isAutoMovePaused = true
  }
  resumeAutoMove(): void {
    this.isAutoMovePaused = false
  }

  //Перемещает персонажа из стартовой позиции в конечную
  autoMove({ start, end, state }: AutoMoveConfig): Promise<boolean> {
    const { stepSize, framesPerStep } = state

    return new Promise((resolve) => {
      const startX = start.x
      const startY = start.y
      const endX = end.x
      const endY = end.y

      //Если движение по прямой
      if ((startX === endX || startY === endY) && !areSame(start, end)) {
        this.setIsAutoMoving(true)

        //Перемещаем героя в стартовую позицию
        this.setPosition(startX, startY)

        //Вычисляем направление движения
        if (endY > startY) {
          this.setViewDirection(ViewDirections.DOWN)
        } else if (endX > startX) {
          this.setViewDirection(ViewDirections.RIGHT)
        } else if (endY < startY) {
          this.setViewDirection(ViewDirections.UP)
        } else if (endX < startX) {
          this.setViewDirection(ViewDirections.LEFT)
        }

        const stopAutoMoving = (): void => {
          this.stop()
          this.setIsAutoMoving(false)
        }

        //Нужна, чтобы не вызывать move(), после того, как встали на конечную позицию
        var shouldMove = true

        //Двигаемся в текущем направлении, пока не дойдём до конечной позиции
        const autoMoveInDirection = (): void => {
          if (!areSame(this.position, end)) {
            if (!this.isAutoMovePaused) {
              //Остановка на конечной позиции, если следующим шагом уходим дальше
              const setPositionToEndAndStopAutoMoving = (x: number, y: number): void => {
                this.setPosition(x, y)
                shouldMove = false
              }

              const positionOnNextStep = this.getPositionOnNextStep()

              if (this.viewDirection === ViewDirections.DOWN) {
                if (positionOnNextStep.y > end.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, end.y)
                }
              } else if (this.viewDirection === ViewDirections.RIGHT) {
                if (positionOnNextStep.x > end.x) {
                  setPositionToEndAndStopAutoMoving(end.x, this.position.y)
                }
              } else if (this.viewDirection === ViewDirections.UP) {
                if (positionOnNextStep.y < end.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, end.y)
                }
              } else if (this.viewDirection === ViewDirections.LEFT) {
                if (positionOnNextStep.x < end.x) {
                  setPositionToEndAndStopAutoMoving(end.x, this.position.y)
                }
              }

              if (shouldMove) {
                this.move({ stepSize, framesPerStep })
              }
            }

            window.requestAnimationFrame(autoMoveInDirection)
          } else {
            stopAutoMoving()
            resolve(true)
          }
        }
        autoMoveInDirection()
      } else {
        resolve(false)
      }
    })
  }
  //^@Обработка движения
}
