import { makeAutoObservable } from 'mobx'

import { Ctx, Size } from 'game-utility-types'

import { ImageContainer } from 'stores/entities/image-container'
import { Sprite } from 'stores/entities/sprite'

import playerSpriteSrc from 'content/sprites/heroes/Player.png'

import { drawSprite } from '../../../../lib/draw-sprite'
import { CurrentGameSettings } from '../settings/current-settings'
import { PlayerMovement } from './movement'

type PlayerStoreConfig = {
  name: string
  settings: CurrentGameSettings
  ctx: Ctx
  mapSize: Size
}

export class Player {
  name: string
  private settings: CurrentGameSettings
  private ctx: Ctx
  private mapSize: Size

  movement: PlayerMovement

  constructor(config: PlayerStoreConfig) {
    this.name = config.name
    this.settings = config.settings
    this.ctx = config.ctx
    this.mapSize = config.mapSize
    //!Движение
    this.movement = new PlayerMovement({
      settings: this.settings,
      mapSize: this.mapSize,
      sprite: this.sprite,
    })

    this.imageContainer.loadAll()

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Изображения
  imageContainer = new ImageContainer({
    sprite: playerSpriteSrc,
  })

  //!Спрайт
  get sprite(): Sprite {
    return new Sprite({
      src: this.imageContainer.list.sprite.imageElement.src,
      width: 14,
      height: 27,
      firstSkipX: 1,
      firstSkipY: 5,
      skipX: 2,
      skipY: 5,
      scale: 2.5,
    })
  }
  update(): void {
    drawSprite(this.ctx, this.imageContainer.list.sprite.imageElement, {
      width: this.sprite.width,
      height: this.sprite.height,
      firstSkipX: this.sprite.firstSkipX,
      firstSkipY: this.sprite.firstSkipY,
      skipX: this.sprite.skipX,
      skipY: this.sprite.skipY,
      scale: this.sprite.scale,
      direction: this.movement.viewDirection,
      state: this.movement.movementLoopState,
      position: this.movement.position,
    })
  }
}
