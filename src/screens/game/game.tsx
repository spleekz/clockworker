import { observer } from 'mobx-react-lite'
import React, { createContext, useContext, useState } from 'react'

import { FC } from 'basic-utility-types'

import { GameStore } from 'stores/game/game.store'
import { useStore } from 'stores/root-store/context'

import { CreateHeroScreen } from './create-hero/screen'
import { GamePlayScreen } from './play/screen'

const GameStoreContext = createContext<GameStore | null>(null)
export const useGameStore = (): GameStore => {
  const gameStore = useContext(GameStoreContext)
  if (!gameStore) {
    throw new Error('You have forgotten to wrap game screen component with GameStoreProvider')
  }
  return gameStore
}

export const Game: FC = observer(() => {
  const { createGameStore } = useStore()
  const [gameStore] = useState(createGameStore)

  return (
    <GameStoreContext.Provider value={gameStore}>
      {gameStore.screen === 'createHero' && <CreateHeroScreen />}
      {gameStore.screen === 'play' && <GamePlayScreen />}
    </GameStoreContext.Provider>
  )
})
