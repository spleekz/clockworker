import { makeAutoObservable } from 'mobx'

import { NonNullableProperties } from 'basic-utility-types'
import { CanvasObject, Directions, MovementLoopState, Position } from 'game-utility-types'

import { Images } from 'stores/entities/images'
import { Sprite } from 'stores/entities/sprite'
import { KeyboardStore } from 'stores/keyboard.store'
import {
  MovementControllers,
  MovementKeys,
  MovementRegulators,
  SettingsStore,
} from 'stores/settings.store'

import playerSpriteSrc from 'content/sprites/heroes/Player.png'

import { areSame } from 'lib/are-same'
import { last } from 'lib/arrays'

import { drawSprite } from '../../../lib/draw-sprite'
import { MapStore } from './map.store'

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

type PlayerStoreConfig = {
  name: string
  settings: SettingsStore
  map: MapStore
  canvasObject: NonNullableProperties<CanvasObject>
  keyboard: KeyboardStore
}

export class PlayerStore {
  private settings: SettingsStore
  private map: MapStore
  private keyboard: KeyboardStore

  name: string
  canvasObject: NonNullableProperties<CanvasObject>
  spriteImage: HTMLImageElement

  constructor(config: PlayerStoreConfig) {
    Object.assign(this, config)

    this.spriteImage = new Image()
    this.spriteImage.src = this.sprite.src

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Изображения
  images = new Images({
    sprite: playerSpriteSrc,
  })

  //!Спрайт
  get sprite(): Sprite {
    return new Sprite({
      src: this.images.list.sprite.element.src,
      width: 14,
      height: 27,
      firstSkipX: 1,
      firstSkipY: 5,
      skipX: 2,
      skipY: 5,
      scale: 2.5,
    })
  }
  drawSprite(): void {
    drawSprite(this.spriteImage, this.canvasObject.ctx, {
      width: this.sprite.width,
      height: this.sprite.height,
      firstSkipX: this.sprite.firstSkipX,
      firstSkipY: this.sprite.firstSkipY,
      skipX: this.sprite.skipX,
      skipY: this.sprite.skipY,
      scale: this.sprite.scale,
      direction: this.currentDirection,
      state: this.movementLoopState,
      position: this.position,
    })
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
  getPositionOnNextStep(): Position {
    const { x, y } = this.position

    if (this.currentDirection === Directions.DOWN) {
      return { x, y: y + this.currentStepSize }
    } else if (this.currentDirection === Directions.RIGHT) {
      return { x: x + this.currentStepSize, y }
    } else if (this.currentDirection === Directions.UP) {
      return { x, y: y - this.currentStepSize }
    } else {
      //left
      return { x: x - this.currentStepSize, y }
    }
  }

  //!Допустимая позиция
  //С учётом размера спрайта
  isOutOfDownMapBorder(position: Position): boolean {
    return position.y + this.sprite.scaledHeight > this.map.height
  }
  isOutOfRightMapBorder(position: Position): boolean {
    return position.x + this.sprite.scaledWidth > this.map.width
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

  //!Направление
  //Направление, куда СМОТРИТ персонаж
  currentDirection: Directions = Directions.DOWN
  setCurrentDirection(direction: Directions): void {
    //Чтобы при смене напрвления сразу была анимация шага
    if (this.isMoving && this.currentDirection !== direction) {
      this.setMovementFramesCount(0)
      this.setMovementLoopIndex(1)
    }
    this.currentDirection = direction
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
        stepSize: 2.0,
        framesPerStep: 11,
      },
      sprint: {
        stepSize: 5.0,
        framesPerStep: 6,
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
  get currentStepSize(): number {
    return this.currentMovementState.stepSize
  }
  get currentFramesPerStep(): number {
    return this.currentMovementState.framesPerStep
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
    return Array.from(this.keyboard.pressedKeys).filter(this.isMovementController)
  }
  get lastPressedMovementController(): string {
    return last(this.pressedMovementControllers)
  }

  get isMovemetKeyPressed(): boolean {
    return this.pressedMovementControllers.length !== 0
  }

  get isMoveDownControllerPressed(): boolean {
    return this.lastPressedMovementController === this.movementControllers.down
  }
  get isMoveRightControllerPressed(): boolean {
    return this.lastPressedMovementController === this.movementControllers.right
  }
  get isMoveUpControllerPressed(): boolean {
    return this.lastPressedMovementController === this.movementControllers.up
  }
  get isMoveLeftControllerPressed(): boolean {
    return this.lastPressedMovementController === this.movementControllers.left
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

  //!Сделать шаг в текущем направлении
  makeStepInCurrentDirection(config?: { stepSize?: number }): void {
    const { stepSize = this.currentStepSize } = config ?? {}

    const { x, y } = this.position

    if (this.currentDirection === Directions.DOWN) {
      this.setPosition(x, y + stepSize)
    } else if (this.currentDirection === Directions.RIGHT) {
      this.setPosition(x + stepSize, y)
    } else if (this.currentDirection === Directions.UP) {
      this.setPosition(x, y - stepSize)
    } else if (this.currentDirection === Directions.LEFT) {
      this.setPosition(x - stepSize, y)
    }
  }

  //!Движение
  move(state?: MovementState): void {
    const { stepSize = this.currentStepSize, framesPerStep = this.currentFramesPerStep } = state ?? {}

    if (!this.isAutoMoving) {
      if (this.isSprintKeyPressed) {
        this.setCurrentMovementState('sprint')
      } else {
        this.setCurrentMovementState('walk')
      }
      //Проверка, если следующим шагом персонаж выходит за границы
      const nextPosition = this.getPositionOnNextStep()
      if (!this.isAllowedPosition(nextPosition)) {
        if (this.isOutOfDownMapBorder(nextPosition)) {
          this.setPositionToDownMapBorder()
        } else if (this.isOutOfRightMapBorder(nextPosition)) {
          this.setPositionToRightMapBorder()
        } else if (this.isOutOfTopMapBorder(nextPosition)) {
          this.setPositionToTopMapBorder()
        } else if (this.isOutOfLeftMapBorder(nextPosition)) {
          this.setPositionToLeftMapBorder()
        }
      } else {
        //Персонаж идёт дальше, только если не выходит за пределы карты
        this.makeStepInCurrentDirection({ stepSize })
      }
    } else {
      //Автомувнутый персонаж может выходить за пределы карты
      this.makeStepInCurrentDirection({ stepSize })
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
    if (this.isMovemetKeyPressed) {
      if (this.isMoveDownControllerPressed) {
        this.setCurrentDirection(Directions.DOWN)
      } else if (this.isMoveRightControllerPressed) {
        this.setCurrentDirection(Directions.RIGHT)
      } else if (this.isMoveUpControllerPressed) {
        this.setCurrentDirection(Directions.UP)
      } else if (this.isMoveLeftControllerPressed) {
        this.setCurrentDirection(Directions.LEFT)
      }
      this.move()
    } else {
      this.stop()
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
          this.setCurrentDirection(Directions.DOWN)
        } else if (endX > startX) {
          this.setCurrentDirection(Directions.RIGHT)
        } else if (endY < startY) {
          this.setCurrentDirection(Directions.UP)
        } else if (endX < startX) {
          this.setCurrentDirection(Directions.LEFT)
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

              if (this.currentDirection === Directions.DOWN) {
                if (positionOnNextStep.y > end.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, end.y)
                }
              } else if (this.currentDirection === Directions.RIGHT) {
                if (positionOnNextStep.x > end.x) {
                  setPositionToEndAndStopAutoMoving(end.x, this.position.y)
                }
              } else if (this.currentDirection === Directions.UP) {
                if (positionOnNextStep.y < end.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, end.y)
                }
              } else if (this.currentDirection === Directions.LEFT) {
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
