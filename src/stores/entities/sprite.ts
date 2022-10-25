import { Ctx, XY } from 'project-utility-types'

import { drawImage } from 'lib/draw-image'

type SpriteConfig = {
  image: HTMLImageElement
  width: number
  height: number
  sourceX?: number
  sourceY?: number
  scale: number
}

export class Sprite {
  image: HTMLImageElement
  width: number
  height: number
  sourceX: number
  sourceY: number
  scale: number

  constructor(config: SpriteConfig) {
    this.image = config.image
    this.width = config.width
    this.height = config.height
    this.sourceX = config.sourceX ?? 0
    this.sourceY = config.sourceY ?? 0
    this.scale = config.scale
  }

  get scaledWidth(): number {
    return this.width * this.scale
  }
  get scaledHeight(): number {
    return this.height * this.scale
  }

  draw = (ctx: Ctx, position: XY): void => {
    drawImage(ctx, this.image, {
      width: this.width,
      height: this.height,
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      scale: this.scale,
      position,
    })
  }
}
