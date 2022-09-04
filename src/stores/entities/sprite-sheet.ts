import { Sprite } from './sprite'

type SpriteSheetConfig = {
  image: HTMLImageElement
  spriteWidth: number
  spriteHeight: number
  firstSkipX: number
  firstSkipY: number
  skipX: number
  skipY: number
}

type GetSpriteConfig = {
  scale?: number
}

export class SpriteSheet {
  image: HTMLImageElement
  spriteWidth: number
  spriteHeight: number
  firstSkipX: number
  firstSkipY: number
  skipX: number
  skipY: number

  constructor(config: SpriteSheetConfig) {
    this.image = config.image
    this.spriteWidth = config.spriteWidth
    this.spriteHeight = config.spriteHeight
    this.firstSkipX = config.firstSkipX
    this.firstSkipY = config.firstSkipY
    this.skipX = config.skipX
    this.skipY = config.skipY
  }

  getSprite(row: number, column: number, config?: GetSpriteConfig): Sprite {
    const spriteSourceX = this.firstSkipX + (this.spriteWidth + this.skipX) * column
    const spriteSourceY = this.firstSkipY + (this.spriteHeight + this.skipY) * row
    const spriteScale = config?.scale ?? 1

    return new Sprite({
      image: this.image,
      width: this.spriteWidth,
      height: this.spriteHeight,
      sourceX: spriteSourceX,
      sourceY: spriteSourceY,
      scale: spriteScale,
    })
  }
}
