import TiledMap from 'tiled-types/types'

import mapSchemeJSON from 'content/scenes/market/maps/main/market-main-map.json'
import tilesetSrc from 'content/scenes/market/maps/main/tileset.png'

import { CharacterList } from '../../characters/controller'
import { GameScreen } from '../../screen'
import { GameScene } from '../scene'

type Config = {
  screen: GameScreen
  characterList: CharacterList
}
export class MarketMainScene extends GameScene<'marketMain'> {
  constructor(config: Config) {
    const mapScheme = JSON.parse(JSON.stringify(mapSchemeJSON)) as TiledMap
    super({
      name: 'marketMain',
      screen: config.screen,
      map: { tilesetSrc, scheme: mapScheme },
      characterList: config.characterList,
    })
  }
}
