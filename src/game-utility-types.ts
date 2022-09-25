export type Canvas = HTMLCanvasElement
export type Ctx = CanvasRenderingContext2D

export type PrimitiveMovementDirection = 'down' | 'right' | 'up' | 'left'
export type ExpandedMovementDirection =
  | PrimitiveMovementDirection
  | 'downright'
  | 'upright'
  | 'upleft'
  | 'downleft'

export type Side = 'top' | 'right' | 'bottom' | 'left'

export type Size = {
  width: number
  height: number
}

export type Hitbox = { x1: number; y1: number; x2: number; y2: number }
export type HitboxWithId = { hitbox: Hitbox; id: string }
