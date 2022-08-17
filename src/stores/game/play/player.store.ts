import { makeAutoObservable } from 'mobx'

import { NonNullableProperties } from 'basic-utility-types'
import { CanvasObject, Directions, MovementLoopState, Position } from 'game-utility-types'

import { Images } from 'stores/entities/images'
import { Sprite } from 'stores/entities/sprite'
import { KeyboardStore } from 'stores/keyboard.store'
import { MovementControlValue, SettingsStore } from 'stores/settings.store'

import playerSpriteSrc from 'content/sprites/heroes/Player.png'

import { areSame } from 'lib/are-same'

import { drawSprite } from '../../../lib/draw-sprite'
import { MapStore } from './map.store'

type PlayerStoreConfig = {
  name: string
  settings: SettingsStore
  map: MapStore
  canvasObject: NonNullableProperties<CanvasObject>
  keyboard: KeyboardStore
}

type MoveConfig = {
  stepSize?: number
  framesPerStep?: number
}

type AutoMoveConfig = MoveConfig

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
      return { x, y: y + this.stepSize }
    } else if (this.currentDirection === Directions.RIGHT) {
      return { x: x + this.stepSize, y }
    } else if (this.currentDirection === Directions.UP) {
      return { x, y: y - this.stepSize }
    } else {
      //left
      return { x: x - this.stepSize, y }
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
  isMoving = false
  setIsMoving(value: boolean): void {
    if (this.isMoving === false && value === true) {
      //Чтобы при начале движения сразу была анимация шага
      this.setMovementLoopIndex(1)
    }
    this.isMoving = value
  }

  //!Клавиши движения
  get movementKeys(): MovementControlValue {
    return this.settings.movementControlValue
  }
  isMovementKey(key: string): boolean {
    return Object.values(this.movementKeys).some((movementKey) => key === movementKey)
  }
  get pressedMovementKeys(): Array<string> {
    return Array.from(this.keyboard.pressedKeys).filter(this.isMovementKey)
  }
  get lastPressedMovementKey(): string | null {
    return this.pressedMovementKeys[this.pressedMovementKeys.length - 1] ?? null
  }

  get isMoveDownKeyPressed(): boolean {
    return this.lastPressedMovementKey === this.movementKeys.down
  }
  get isMoveRightKeyPressed(): boolean {
    return this.lastPressedMovementKey === this.movementKeys.right
  }
  get isMoveUpKeyPressed(): boolean {
    return this.lastPressedMovementKey === this.movementKeys.up
  }
  get isMoveLeftKeyPressed(): boolean {
    return this.lastPressedMovementKey === this.movementKeys.left
  }
  get isMovemetKeyPressed(): boolean {
    return (
      this.isMoveDownKeyPressed ||
      this.isMoveRightKeyPressed ||
      this.isMoveUpKeyPressed ||
      this.isMoveLeftKeyPressed
    )
  }

  //!Сделать шаг в текущем направлении
  makeStepInCurrentDirection(config?: { stepSize?: number }): void {
    const { stepSize = this.stepSize } = config ?? {}

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
  get stepSize(): number {
    return 3.3
  }
  get framesPerStep(): number {
    return 9
  }

  move(config?: MoveConfig): void {
    const { stepSize = this.stepSize, framesPerStep = this.framesPerStep } = config ?? {}

    this.setIsMoving(true)

    if (!this.isAutoMoving) {
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
    this.setIsMoving(false)
  }

  //!Обработка клавиш движения
  handleMovementKeys(): void {
    if (this.isMovemetKeyPressed) {
      if (this.isMoveDownKeyPressed) {
        this.setCurrentDirection(Directions.DOWN)
      } else if (this.isMoveRightKeyPressed) {
        this.setCurrentDirection(Directions.RIGHT)
      } else if (this.isMoveUpKeyPressed) {
        this.setCurrentDirection(Directions.UP)
      } else if (this.isMoveLeftKeyPressed) {
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

  autoMove(startPosition: Position, endPosition: Position, config?: AutoMoveConfig): Promise<boolean> {
    const { stepSize = this.stepSize, framesPerStep = this.framesPerStep } = config ?? {}

    return new Promise((resolve) => {
      const startX = startPosition.x
      const startY = startPosition.y
      const endX = endPosition.x
      const endY = endPosition.y

      //Если движение по прямой
      if ((startX === endX || startY === endY) && !areSame(startPosition, endPosition)) {
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
          if (!areSame(this.position, endPosition)) {
            if (!this.isAutoMovePaused) {
              //Остановка на конечной позиции, если следующим шагом уходим дальше
              const setPositionToEndAndStopAutoMoving = (x: number, y: number): void => {
                this.setPosition(x, y)
                shouldMove = false
              }

              const positionOnNextStep = this.getPositionOnNextStep()

              if (this.currentDirection === Directions.DOWN) {
                if (positionOnNextStep.y > endPosition.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, endPosition.y)
                }
              } else if (this.currentDirection === Directions.RIGHT) {
                if (positionOnNextStep.x > endPosition.x) {
                  setPositionToEndAndStopAutoMoving(endPosition.x, this.position.y)
                }
              } else if (this.currentDirection === Directions.UP) {
                if (positionOnNextStep.y < endPosition.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, endPosition.y)
                }
              } else if (this.currentDirection === Directions.LEFT) {
                if (positionOnNextStep.x < endPosition.x) {
                  setPositionToEndAndStopAutoMoving(endPosition.x, this.position.y)
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
