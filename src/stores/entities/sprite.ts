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
    Object.assign(this, config)
  }

  get scaledWidth(): number {
    return this.width * this.scale
  }
  get scaledHeight(): number {
    return this.height * this.scale
  }
}
