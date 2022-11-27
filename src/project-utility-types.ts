export type Canvas = HTMLCanvasElement
export type Ctx = CanvasRenderingContext2D

export type PrimitiveMovementDirection = 'down' | 'right' | 'up' | 'left'
export type ExpandedMovementDirection =
  | PrimitiveMovementDirection
  | 'downright'
  | 'upright'
  | 'upleft'
  | 'downleft'

export type Side = 'bottom' | 'right' | 'top' | 'left'

export type Size = {
  width: number
  height: number
}

export type XY = {
  x: number
  y: number
}
export type PointPair = {
  x1: number
  y1: number
  x2: number
  y2: number
}
