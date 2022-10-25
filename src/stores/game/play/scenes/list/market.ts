import mapSchemeJSON from 'content/scenes/market/maps/main/main-market-map.json'
import tilesetSrc from 'content/scenes/market/maps/main/tileset.png'

import { CharactersList } from '../../characters/controller'
import { GameScreen } from '../../screen'
import { GameScene } from '../scene'

type Config = {
  screen: GameScreen
  characterList: CharactersList
}
export const createMainGameScene = (config: Config): GameScene<'market'> => {
  const mapScheme = JSON.parse(JSON.stringify(mapSchemeJSON))

  return new GameScene({
    name: 'market',
    screen: config.screen,
    map: { tilesetSrc, scheme: mapScheme },
    characterList: config.characterList,
  })
}
