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
    super({ is: config.is })

    this.imageContainer = new ImageContainer(
      config.imageContainerConfig.initialImageList,
      config.imageContainerConfig.options,
    )

    this.spriteSheet = new SpriteSheet({
      ...config.spriteSheetConfig,
      image: this.imageContainer.list.spriteSheet.imageElement,
    })

    this.screen = config.screen

    if (config.initialSpriteScale) {
      this.setSpriteScale(config.initialSpriteScale)
    }

    this.animationController = new AnimationController({
      spriteSheet: this.spriteSheet,
      animationList: config.animationList,
      initialValue: 'walkDown' as AnimationName,
    })

    this.movement = new CharacterMovement({
      position: this.position,
      animationController: this.animationController,
      movementTypes: config.movementTypes,
      regulators: config.regulators,
      initialMovementType: config.initialMovementType,
    })
  }

  spriteScale = 1
  setSpriteScale = (scale: number): void => {
    this.spriteScale = scale
    //Обновление размеров body в соответствии с новым масштабом спрайта
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
