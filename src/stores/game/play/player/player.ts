import { makeAutoObservable } from 'mobx'

import { Ctx, Size } from 'game-utility-types'

import { ImageContainer } from 'stores/entities/image-container'
import { Sprite } from 'stores/entities/sprite'
import { KeyboardStore } from 'stores/keyboard.store'
import { SettingsStore } from 'stores/settings.store'

import playerSpriteSrc from 'content/sprites/heroes/Player.png'

import { drawSprite } from '../../../../lib/draw-sprite'
import { PlayerMovement } from './movement'

type PlayerStoreConfig = {
  name: string
  settings: SettingsStore
  ctx: Ctx
  mapSize: Size
  keyboard: KeyboardStore
}

export class Player {
  private settings: SettingsStore
  private ctx: Ctx
  private mapSize: Size
  private keyboard: KeyboardStore

  name: string

  movement: PlayerMovement

  constructor(config: PlayerStoreConfig) {
    Object.assign(this, config)

    //!Движение
    this.movement = new PlayerMovement({
      keyboard: this.keyboard,
      mapSize: this.mapSize,
      settings: this.settings,
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
