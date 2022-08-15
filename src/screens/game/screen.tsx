import { observer } from 'mobx-react-lite'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { GameStore } from 'stores/game/game.store'
import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

import { QuitInMainMenuConfirm } from 'components/game-popups/quit-in-main-menu-confirm'
import { Textbox } from 'components/textbox/textbox'
import { SettingsMenu } from 'screens/main/settings/menu'

import { GameOpening } from './opening'
import { PauseMenu } from './pause-menu'

const GameStoreContext = createContext<GameStore | null>(null)
export const useGameStore = (): GameStore => {
  const gameStore = useContext(GameStoreContext)
  if (!gameStore) {
    throw new Error('You have forgotten to wrap game screen component with GameStoreProvider')
  }
  return gameStore
}

export const GameScreen: FC = observer(() => {
  const { appStore, createGameStore } = useStore()
  const [gameStore] = useState(() => {
    if (!appStore.customUserDataForGameStore) {
      throw new Error('No custom user data for Game Store provided')
    }
    return createGameStore({ customUserData: appStore.customUserDataForGameStore })
  })

  useKey({
    key: 'Escape',
    fn: () => {
      if (!gameStore.isOpening) {
        if (!gameStore.isTextboxOpened) {
          if (appStore.isQuitGameConfirmOpened) {
            appStore.closeQuitGameConfirm()
          } else if (appStore.isQuitInMainMenuConfirmOpened) {
            appStore.closeQuitInMainMenuConfirm()
          } else if (gameStore.isSettingsMenuOpened) {
            gameStore.closeSettingsMenu()
            gameStore.openGamePauseMenu()
          } else {
            gameStore.toggleGamePause()
            gameStore.toggleGamePauseMenu()
          }
        }
      }
    },
  })

  useEffect(() => {
    gameStore.setupGame()
    gameStore.showOpening().then(() => {
      gameStore.gameLoop()
      gameStore.openTextbox()
    })
  }, [])

  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (gameStore.isGameLoaded && gameStore.canvasObject.canvas && containerRef.current) {
      containerRef.current.appendChild(gameStore.canvasObject.canvas)
    }
  }, [gameStore.isGameLoaded])

  return (
    <GameStoreContext.Provider value={gameStore}>
      <GameOpening isOpened={gameStore.isOpening} />
      {gameStore.isGameLoaded && (
        <Container ref={containerRef}>
          <PauseMenu isOpened={gameStore.isGamePauseMenuOpened} />
          <SettingsMenu
            isOpened={gameStore.isSettingsMenuOpened}
            onClose={gameStore.closeSettingsMenu}
            afterClose={gameStore.openGamePauseMenu}
          />
          <QuitInMainMenuConfirm isOpened={appStore.isQuitInMainMenuConfirmOpened} />

          {gameStore.script && (
            <Textbox
              isOpened={gameStore.isTextboxOpened}
              afterClose={gameStore.heroEntering}
              withCloseCross={true}
              text={gameStore.script.content.welcome}
            />
          )}
        </Container>
      )}
    </GameStoreContext.Provider>
  )
})

const Container = styled.div`
  position: relative;
  flex: 1 0 auto;
  display: flex;
`
