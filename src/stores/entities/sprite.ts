type SpriteConfig = {
  src: string
  width: number
  height: number
  firstSkipX: number
  firstSkipY: number
  skipX: number
  skipY: number
  scale: number
}

export class Sprite {
  src: string
  width: number
  height: number
  firstSkipX: number
  firstSkipY: number
  skipX: number
  skipY: number
  scale: number

  constructor(config: SpriteConfig) {
    this.src = config.src
    this.width = config.width
    this.height = config.height
    this.firstSkipX = config.firstSkipX
    this.firstSkipY = config.firstSkipY
    this.skipX = config.skipX
    this.skipY = config.skipY
    this.scale = config.scale
  }

  get scaledWidth(): number {
    return this.width * this.scale
  }
  get scaledHeight(): number {
    return this.height * this.scale
  }
}
