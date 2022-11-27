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
export const createMarketMainScene = (config: Config): GameScene<'marketMain'> => {
  const mapScheme = JSON.parse(JSON.stringify(mapSchemeJSON)) as TiledMap
  return new GameScene({
    name: 'marketMain',
    screen: config.screen,
    map: { tilesetSrc, scheme: mapScheme },
    characterList: config.characterList,
  })
}
