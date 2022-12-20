import { AnimationController, AnimationList } from 'stores/entities/animation-controller'
import { ImageContainer, ImageContainerOptions, ImageSrcs } from 'stores/entities/image-container'
import { Sprite } from 'stores/entities/sprite'
import { SpriteSheet, SpriteSheetConfig } from 'stores/entities/sprite-sheet'

import { Body, BodyConfig } from '../body'
import { GameScreen } from '../screen'
import { CharacterMovementAnimationName } from './animation'
import { CharacterMovement, CharacterMovementConfig } from './movement'

export type CharacterInitialImageList = ImageSrcs & { spriteSheet: string }

export type CharacterConfig<
  InitialImageList extends CharacterInitialImageList,
  AnimationName extends CharacterMovementAnimationName,
  MovementTypeName extends string,
  MovementRegulatorName extends string,
> = BodyConfig & {
  imageContainerConfig: {
    initialImageList: InitialImageList
    options?: ImageContainerOptions
  }
  initialSpriteScale: number
  spriteSheetConfig: Omit<SpriteSheetConfig, 'image'>
  screen: GameScreen
  animationList: AnimationList<AnimationName>
} & Omit<
    CharacterMovementConfig<MovementTypeName, MovementRegulatorName>,
    'position' | 'animationController'
  >

export class Character<
  InitialImageList extends CharacterInitialImageList,
  AnimationName extends CharacterMovementAnimationName,
  MovementTypeName extends string,
  MovementRegulatorName extends string,
> extends Body {
  imageContainer: ImageContainer<InitialImageList>
  spriteSheet: SpriteSheet
  screen: GameScreen

  animationController: AnimationController<AnimationName>
  movement: CharacterMovement<MovementTypeName, MovementRegulatorName>

  constructor(
    config: CharacterConfig<InitialImageList, AnimationName, MovementTypeName, MovementRegulatorName>,
  ) {
    const {
      is,
      screen,
      imageContainerConfig,
      spriteSheetConfig,
      initialSpriteScale,
      animationList,
      movementTypes,
      regulators,
      initialMovementType,
    } = config

    super({ is: is })

    this.screen = screen

    this.imageContainer = new ImageContainer(
      imageContainerConfig.initialImageList,
      imageContainerConfig.options,
    )

    this.spriteSheet = new SpriteSheet({
      ...spriteSheetConfig,
      image: this.imageContainer.list.spriteSheet.imageElement,
    })

    if (initialSpriteScale) {
      this.setSpriteScale(initialSpriteScale)
    }

    this.animationController = new AnimationController({
      spriteSheet: this.spriteSheet,
      animationList: animationList,
      initialValue: 'walkDown' as AnimationName,
    })

    this.movement = new CharacterMovement({
      position: this.position,
      animationController: this.animationController,
      movementTypes,
      regulators,
      initialMovementType,
    })
  }

  spriteScale = 1
  setSpriteScale = (scale: number): void => {
    this.spriteScale = scale
    // обновление размеров body в соответствии с новым масштабом спрайта
    this.setSize({
      width: this.spriteSheet.spriteWidth * scale,
      height: this.spriteSheet.spriteHeight * scale,
    })
  }

  get currentSprite(): Sprite {
    return this.animationController.currentSprite
  }

  update = (): void => {
    this.animationController.current.update()
    this.screen.drawSprite(this.currentSprite, this.position)
  }
}
