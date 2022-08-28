import marketSceneBackgroundSrc from 'content/scenes/market-scene.png'

import { GameScreen } from '../../screen'
import { GameScene } from '../scene'

export const createMainGameScene = (screen: GameScreen): GameScene<'market', 'marketSceneMap'> => {
  return new GameScene({
    name: 'market',
    screen,
    map: {
      width: 1920,
      height: 1080,
      background: { name: 'marketSceneMap', src: marketSceneBackgroundSrc },
    },
  })
}
