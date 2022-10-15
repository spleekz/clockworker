import { Canvas, Ctx } from 'game-utility-types'

import { Sprite } from 'stores/entities/sprite'

import { XY } from 'lib/coords'

type GameScreenConfig = {
  width: number
  height: number
}

export class GameScreen {
  width: number
  height: number

  canvas: Canvas
  ctx: Ctx

  constructor(config: GameScreenConfig) {
    this.width = config.width
    this.height = config.height

    this.initializeCanvasAndCtx()
  }

  initializeCanvasAndCtx = (): void => {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height

    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')!
  }

  clear = (): void => {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  drawSprite = (sprite: Sprite, position: XY): void => {
    sprite.draw(this.ctx, position)
  }
}
