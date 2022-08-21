import { makeAutoObservable } from 'mobx'

import { Canvas } from 'game-utility-types'

import { Images } from 'stores/entities/images'

export type MapConfig = {
  canvas: Canvas
  width: number
  height: number
  background?: string
}

export class Map {
  images: Images

  canvas: Canvas
  width: number
  height: number
  background: string | null = null

  constructor(config: MapConfig) {
    Object.assign(this, {
      ...config,
      background: config.background ?? null,
    })

    if (this.background) {
      this.images = new Images({
        mapBackground: this.background,
      })

      this.canvas.style.backgroundImage = `url(${this.images.list.mapBackground.element.src})`
      this.canvas.style.backgroundPosition = 'center'
      this.canvas.style.backgroundRepeat = 'no-repeat'
      this.canvas.style.backgroundSize = 'cover'
    }

    makeAutoObservable(this)
  }
}
