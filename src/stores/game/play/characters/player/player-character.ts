import playerCharacterSpriteSheetSrc from 'content/sprites/characters/Player.png'

import { GameScreen } from '../../screen'
import { GameSettings } from '../../settings/settings'
import { Character } from '../character'
import { PlayerCharacterMovement } from './movement/movement'

export type PlayerCharacterConfig = {
  name: string
  settings: GameSettings
  screen: GameScreen
}
export class PlayerCharacter extends Character<{ spriteSheet: typeof playerCharacterSpriteSheetSrc }> {
  name: string
  private settings: GameSettings

  movement: PlayerCharacterMovement

  constructor(config: PlayerCharacterConfig) {
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

    //!Движение
    this.movement = new PlayerCharacterMovement({
      position: this.position,
      settings: this.settings,
      animation: this.animation,
    })

    this.size = {
      width: this.currentSprite.width * this.currentSprite.scale,
      height: this.currentSprite.height * this.currentSprite.scale,
    }
  }
}
