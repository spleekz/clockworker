import { makeAutoObservable } from 'mobx'

type MovementLoopFrame = 0 | 1 | 2 | 3

export enum ViewDirections {
  DOWN = 0,
  RIGHT = 1,
  UP = 2,
  LEFT = 3,
}

export class CharacterAnimation {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  movementLoop: Array<MovementLoopFrame> = [0, 1, 2, 3]
  movementLoopIndex = 0
  setMovementLoopIndex(index: number): void {
    this.movementLoopIndex = index
  }
  increaseMovementLoopIndex(): void {
    if (this.movementLoopIndex === this.movementLoop.length - 1) {
      this.setMovementLoopIndex(0)
    } else {
      this.movementLoopIndex += 1
    }
  }
  get movementLoopFrame(): MovementLoopFrame {
    return this.movementLoop[this.movementLoopIndex]
  }

  movementFramesCount = 0
  setMovementFramesCount(value: number): void {
    this.movementFramesCount = value
  }
  increaseMovementFramesCount(): void {
    this.movementFramesCount += 1
  }

  viewDirection: ViewDirections = ViewDirections.DOWN
  setViewDirection(direction: ViewDirections): void {
    this.viewDirection = direction
  }
}
