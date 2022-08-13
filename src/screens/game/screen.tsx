import { observer } from 'mobx-react-lite'
import React, { createContext, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { GameStore } from 'stores/game/game.store'
import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

import { QuitInMainMenuConfirm } from 'components/game-popups/quit-in-main-menu-confirm'
import { TextBox } from 'components/text-box/text-box'
import { SettingsMenu } from 'screens/main/settings/menu'

import { GameCanvas } from './canvas'
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
      if (!gameStore.isTextBoxOpened) {
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
    },
  })

  useEffect(() => {
    if (gameStore.canvasObject.canvas && gameStore.canvasObject.ctx) {
      gameStore.setupGame()
      gameStore.gameLoop()
      gameStore.openTextBox()
    }
  }, [])

  return (
    <GameStoreContext.Provider value={gameStore}>
      <Container>
        <PauseMenu isOpened={gameStore.isGamePauseMenuOpened} />
        <SettingsMenu
          isOpened={gameStore.isSettingsMenuOpened}
          onClose={gameStore.closeSettingsMenu}
          afterClose={gameStore.openGamePauseMenu}
        />
        <QuitInMainMenuConfirm isOpened={appStore.isQuitInMainMenuConfirmOpened} />

        {gameStore.player && (
          <TextBox
            isOpened={gameStore.isTextBoxOpened}
            afterClose={gameStore.heroEntering}
            withCloseCross={true}
            text={gameStore.script.content.welcome}
          />
        )}

        <GameCanvas />
      </Container>
    </GameStoreContext.Provider>
  )
})

const Container = styled.div`
  position: relative;
  flex: 1 0 auto;
  display: flex;
`
