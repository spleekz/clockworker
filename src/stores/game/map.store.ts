import { makeAutoObservable } from 'mobx'

import { Canvas } from 'game-utility-types'

export type MapStoreConfig = {
  canvas: Canvas
  width: number
  height: number
  background?: string
}

export class MapStore {
  canvas: Canvas
  width: number
  height: number
  background: string | null = null

  constructor(config: MapStoreConfig) {
    Object.assign(this, {
      ...config,
      background: config.background ?? null,
    })

    if (this.background) {
      this.canvas.style.backgroundImage = `url(${this.background})`
      this.canvas.style.backgroundPosition = 'center'
      this.canvas.style.backgroundRepeat = 'no-repeat'
      this.canvas.style.backgroundSize = 'cover'
    }

    makeAutoObservable(this)
  }
}
