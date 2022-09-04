import { makeAutoObservable } from 'mobx'

import { Size } from 'game-utility-types'

import { ImageContainer } from 'stores/entities/image-container'
import { Sprite } from 'stores/entities/sprite'
import { SpriteSheet } from 'stores/entities/sprite-sheet'

import playerSpriteSheetSrc from 'content/sprites/heroes/Player.png'

import { GameScreen } from '../screen'
import { CurrentGameSettings } from '../settings/current-settings'
import { PlayerAnimation } from './animation'
import { PlayerMovement } from './movement'

type PlayerStoreConfig = {
  name: string
  settings: CurrentGameSettings
  screen: GameScreen
  mapSize: Size
}

export class Player {
  name: string
  private settings: CurrentGameSettings
  private screen: GameScreen
  private mapSize: Size

  movement: PlayerMovement

  constructor(config: PlayerStoreConfig) {
    this.name = config.name
    this.settings = config.settings
    this.screen = config.screen
    this.mapSize = config.mapSize

    //!Движение
    this.movement = new PlayerMovement({
      settings: this.settings,
      mapSize: this.mapSize,
      sprite: this.currentSprite,
      animation: this.animation,
    })

    this.imageContainer.loadAll()

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Изображения
  imageContainer = new ImageContainer({ spriteSheet: playerSpriteSheetSrc }, { loadImmediately: true })

  //!Анимация
  animation = new PlayerAnimation()

  //!Спрайты
  spriteSheet = new SpriteSheet({
    image: this.imageContainer.list.spriteSheet.imageElement,
    spriteWidth: 14,
    spriteHeight: 27,
    firstSkipX: 1,
    firstSkipY: 5,
    skipX: 2,
    skipY: 5,
  })
  get currentSprite(): Sprite {
    return this.spriteSheet.getSprite(this.animation.viewDirection, this.animation.movementLoopFrame, {
      scale: 2.5,
    })
  }

  update(): void {
    this.screen.drawSprite(this.currentSprite, this.movement.position)
  }
}
