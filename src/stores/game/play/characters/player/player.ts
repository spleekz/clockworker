import { Size } from 'game-utility-types'

import playerCharacterSpriteSheetSrc from 'content/sprites/characters/Player.png'

import { GameScreen } from '../../screen'
import { CurrentGameSettings } from '../../settings/current-settings'
import { Character } from '../character'
import { PlayerMovement } from './movement'

type PlayerStoreConfig = {
  nickname: string
  settings: CurrentGameSettings
  screen: GameScreen
  mapSize: Size
}

export class Player extends Character<{ spriteSheet: typeof playerCharacterSpriteSheetSrc }> {
  nickname: string
  private settings: CurrentGameSettings
  private mapSize: Size

  movement: PlayerMovement

  constructor(config: PlayerStoreConfig) {
    super({
      name: 'player',
      imageContainerConfig: {
        initialImageList: {
          spriteSheet: playerCharacterSpriteSheetSrc,
        },
        options: {
          loadImmediately: true,
        },
      },
      spriteSheetConfig: {
        spriteWidth: 14,
        spriteHeight: 27,
        firstSkipX: 1,
        firstSkipY: 5,
        skipX: 2,
        skipY: 5,
      },
      screen: config.screen,
      initialSpriteScale: 2.5,
    })
    this.nickname = config.nickname
    this.settings = config.settings

    this.mapSize = config.mapSize

    //!Движение
    this.movement = new PlayerMovement({
      position: this.position,
      settings: this.settings,
      mapSize: this.mapSize,
      sprite: this.currentSprite,
      animation: this.animation,
    })

    this.imageContainer.loadAll()

    this.size = {
      width: this.currentSprite.width * this.currentSprite.scale,
      height: this.currentSprite.height * this.currentSprite.scale,
    }
  }
}
