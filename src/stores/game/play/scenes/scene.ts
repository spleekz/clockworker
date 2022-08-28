import { Size } from 'game-utility-types'

import { ImageContainer } from 'stores/entities/image-container'

import { GameScreen } from '../screen'

export class GameScene<SceneName extends string, MapName extends string> {
  private screen: GameScreen

  name: SceneName
  map: { background: { src: string; name: MapName } } & Size

  imageContainer: ImageContainer<Record<MapName, string>>

  constructor(config: {
    name: SceneName
    map: { background: { src: string; name: MapName } } & Size
    screen: GameScreen
  }) {
    this.screen = config.screen

    this.name = config.name

    this.imageContainer = new ImageContainer({
      [config.map.background.name]: config.map.background.src,
    } as Record<MapName, string>)

    this.map = {
      background: { name: config.map.background.name, src: config.map.background.src },
      width: config.map.width,
      height: config.map.height,
    }
  }

  setMap(): void {
    this.screen.setBackground(this.map.background.src)
  }
}
