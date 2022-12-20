export type Canvas = HTMLCanvasElement
export type Ctx = CanvasRenderingContext2D

export type PrimitiveDirection = 'down' | 'right' | 'up' | 'left'
export type ExpandedDirection = PrimitiveDirection | 'downright' | 'upright' | 'upleft' | 'downleft'

export type Side = 'bottom' | 'right' | 'top' | 'left'

export type Size = {
  width: number
  height: number
}

export type XY = {
  x: number
  y: number
}

export type SheetPosition = { row: number; column: number }

export type PointPair = {
  x1: number
  y1: number
  x2: number
  y2: number
}

export type Indexes = [number, number]
