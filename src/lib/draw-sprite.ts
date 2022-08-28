import { MovementLoopState, Position, ViewDirections } from 'game-utility-types'

export type DrawImageConfig = {
  width: number
  height: number
  firstSkipX: number
  firstSkipY: number
  skipX: number
  skipY: number
  scale?: number
  direction: ViewDirections
  state: MovementLoopState
  position: Position
}

export const drawSprite = (
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  config: DrawImageConfig,
): void => {
  const {
    width,
    height,
    firstSkipX,
    firstSkipY,
    skipX,
    skipY,
    scale = 1,
    direction,
    state,
    position,
  } = config

  const sx = firstSkipX + (width + skipX) * state

  const sy = firstSkipY + (height + skipY) * direction

  ctx.drawImage(sprite, sx, sy, width, height, position.x, position.y, width * scale, height * scale)
}
