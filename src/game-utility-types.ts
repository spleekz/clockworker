export type Canvas = HTMLCanvasElement
export type Ctx = CanvasRenderingContext2D

export enum ViewDirections {
  DOWN = 0,
  RIGHT = 1,
  UP = 2,
  LEFT = 3,
}

export type PrimitiveMovementDirection = 'down' | 'right' | 'up' | 'left'
export type ExpandedMovementDirection =
  | PrimitiveMovementDirection
  | 'downright'
  | 'upright'
  | 'upleft'
  | 'downleft'

export type MovementLoopState = 0 | 1 | 2 | 3

export type Position = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}
