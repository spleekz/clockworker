import { Size } from 'game-utility-types'

import playerCharacterSpriteSheetSrc from 'content/sprites/characters/Player.png'

import { GameScreen } from '../../screen'
import { CurrentGameSettings } from '../../settings/current-settings'
import { Character } from '../character'
import { PlayerCharacterMovement } from './movement'

export type PlayerCharacterStoreConfig = {
  name: string
  settings: CurrentGameSettings
  screen: GameScreen
  mapSize: Size
}

export class PlayerCharacter extends Character<{ spriteSheet: typeof playerCharacterSpriteSheetSrc }> {
  name: string
  private settings: CurrentGameSettings
  private mapSize: Size

  movement: PlayerCharacterMovement

  constructor(config: PlayerCharacterStoreConfig) {
    super({
      is: 'player',
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
    this.name = config.name
    this.settings = config.settings

    this.mapSize = config.mapSize

    //!Движение
    this.movement = new PlayerCharacterMovement({
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
