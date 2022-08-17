export type Canvas = HTMLCanvasElement
export type Ctx = CanvasRenderingContext2D

export type CanvasObject = {
  canvas: Canvas | null
  ctx: Ctx | null
}

export enum Directions {
  DOWN = 0,
  RIGHT = 1,
  UP = 2,
  LEFT = 3,
}
export type MovementLoopState = 0 | 1 | 2 | 3

export type Position = {
  x: number
  y: number
}
