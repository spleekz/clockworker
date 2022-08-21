import { observer } from 'mobx-react-lite'
import React, { createContext, useContext, useState } from 'react'
import styled from 'styled-components'

import { animated, useTransition } from '@react-spring/web'
import { FC } from 'basic-utility-types'

import { GameStore } from 'stores/game/store'
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

  const gameTransition = useTransition(gameStore.screen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      duration: gameStore.opening.transitionMs,
    },
  })

  return (
    <GameStoreContext.Provider value={gameStore}>
      {gameTransition((styles, item) => {
        return item === 'createHero' ? (
          <GamePageContainer
            style={{
              ...styles,
              opacity: 1,
            }}
          >
            <CreateHeroScreen />
          </GamePageContainer>
        ) : (
          <GamePageContainer style={styles}>
            <GamePlayScreen />
          </GamePageContainer>
        )
      })}
    </GameStoreContext.Provider>
  )
})

const GamePageContainer = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
`
