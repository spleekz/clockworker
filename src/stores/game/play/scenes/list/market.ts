import mapSchemeJSON from 'content/scenes/market/maps/main/main-market-map.json'
import tilesetSrc from 'content/scenes/market/maps/main/tileset.png'

import { GameScreen } from '../../screen'
import { GameScene } from '../scene'

export const createMainGameScene = (screen: GameScreen): GameScene<'market'> => {
  const mapScheme = JSON.parse(JSON.stringify(mapSchemeJSON))

  return new GameScene({
    name: 'market',
    screen,
    map: { tilesetSrc, scheme: mapScheme },
  })
}
