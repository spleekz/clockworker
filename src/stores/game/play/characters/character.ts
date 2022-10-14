import { ImageContainer, ImageContainerOptions } from 'stores/entities/image-container'
import { Sprite } from 'stores/entities/sprite'
import { SpriteSheet, SpriteSheetConfig } from 'stores/entities/sprite-sheet'

import { Body } from '../body'
import { GameScreen } from '../screen'
import { CharacterAnimation } from './animation'

type CharacterConfig<
  InitialImageList extends { [imageName: string]: string } & { spriteSheet: string },
> = {
  is: string
  imageContainerConfig: {
    initialImageList: InitialImageList
    options?: ImageContainerOptions
  }
  spriteSheetConfig: Omit<SpriteSheetConfig, 'image'>
  screen: GameScreen
  initialSpriteScale?: number
}

export class Character<
  InitialImageList extends { [imageName: string]: string } & { spriteSheet: string },
> extends Body {
  imageContainer: ImageContainer<InitialImageList>
  spriteSheet: SpriteSheet
  screen: GameScreen

  constructor(config: CharacterConfig<InitialImageList>) {
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
  }

  animation = new CharacterAnimation()

  spriteScale = 1
  setSpriteScale(scale: number): void {
    this.spriteScale = scale
    //Обновление размеров body в соответствии с новым спрайтом
    this.setSize({
      width: this.spriteSheet.spriteWidth * scale,
      height: this.spriteSheet.spriteHeight * scale,
    })
  }

  get currentSprite(): Sprite {
    return this.spriteSheet.getSprite(this.animation.viewDirection, this.animation.movementLoopFrame, {
      scale: this.spriteScale,
    })
  }

  update(): void {
    this.screen.drawSprite(this.currentSprite, this.position)
  }
}
