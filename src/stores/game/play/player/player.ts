import { makeAutoObservable } from 'mobx'

import { NonNullableProperties } from 'basic-utility-types'
import { CanvasObject } from 'game-utility-types'

import { Images } from 'stores/entities/images'
import { Sprite } from 'stores/entities/sprite'
import { KeyboardStore } from 'stores/keyboard.store'
import { SettingsStore } from 'stores/settings.store'

import playerSpriteSrc from 'content/sprites/heroes/Player.png'

import { drawSprite } from '../../../../lib/draw-sprite'
import { Map } from '../map'
import { PlayerMovement } from './player-movement'

type PlayerStoreConfig = {
  name: string
  settings: SettingsStore
  map: Map
  canvasObject: NonNullableProperties<CanvasObject>
  keyboard: KeyboardStore
}

export class Player {
  private settings: SettingsStore
  private map: Map
  private keyboard: KeyboardStore

  name: string
  canvasObject: NonNullableProperties<CanvasObject>
  spriteImage: HTMLImageElement

  movement: PlayerMovement

  constructor(config: PlayerStoreConfig) {
    Object.assign(this, config)

    //!Движение
    this.movement = new PlayerMovement({
      keyboard: this.keyboard,
      map: this.map,
      settings: this.settings,
      sprite: this.sprite,
    })

    this.spriteImage = new Image()
    this.spriteImage.src = this.sprite.src

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Изображения
  images = new Images({
    sprite: playerSpriteSrc,
  })

  //!Спрайт
  get sprite(): Sprite {
    return new Sprite({
      src: this.images.list.sprite.element.src,
      width: 14,
      height: 27,
      firstSkipX: 1,
      firstSkipY: 5,
      skipX: 2,
      skipY: 5,
      scale: 2.5,
    })
  }
  drawSprite(): void {
    drawSprite(this.spriteImage, this.canvasObject.ctx, {
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
