import playerCharacterSpriteSheetSrc from 'content/sprites/characters/Player.png'

import { GameScreen } from '../../screen'
import { GameSettings } from '../../settings/settings'
import { Character } from '../character'
import { PlayerCharacterAnimationName, getPlayerCharacterAnimationList } from './animation'
import {
  PlayerCharacterMovement,
  PlayerCharacterMovementRegulatorName,
  PlayerCharacterMovementTypeName,
  playerCharacterInitialMovementType,
  playerCharacterMovementRegulators,
  playerCharacterMovementTypes,
} from './movement/movement'

type InitialImageList = { spriteSheet: typeof playerCharacterSpriteSheetSrc }

const initialSpriteScale = 2.5

export type PlayerCharacterConfig = {
  name: string
  settings: GameSettings
  screen: GameScreen
}

export class PlayerCharacter extends Character<
  InitialImageList,
  PlayerCharacterAnimationName,
  PlayerCharacterMovementTypeName,
  PlayerCharacterMovementRegulatorName
> {
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
        defaultScale: initialSpriteScale,
      },
      initialSpriteScale,
      screen: config.screen,
      animationList: getPlayerCharacterAnimationList({ scale: initialSpriteScale }),
      movementTypes: playerCharacterMovementTypes,
      regulators: playerCharacterMovementRegulators,
      initialMovementType: playerCharacterInitialMovementType,
    })

    this.name = config.name
    this.settings = config.settings

    //!Движение
    this.movement = new PlayerCharacterMovement({
      position: this.position,
      settings: this.settings,
      animationController: this.animationController,
      movementTypes: playerCharacterMovementTypes,
      regulators: playerCharacterMovementRegulators,
      initialMovementType: playerCharacterInitialMovementType,
    })

    this.size = {
      width: this.currentSprite.width * this.currentSprite.scale,
      height: this.currentSprite.height * this.currentSprite.scale,
    }
  }
}
