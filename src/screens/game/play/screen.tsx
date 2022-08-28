import { observer } from 'mobx-react-lite'
import React, { createContext, useContext, useState } from 'react'

import { FC } from 'basic-utility-types'

import { GamePlayStore } from 'stores/game/play/store'
import { useStore } from 'stores/root-store/context'

import { QuitInMainMenuConfirm } from 'components/game-popups/quit-in-main-menu-confirm'
import { SettingsMenu } from 'screens/main/settings/menu'

import { useGameStore } from '../game'
import { GameOpening } from '../opening'
import { handleGamePlayScreenEsc } from './handle-esc'
import { PauseMenu } from './pause-menu'
import { PlayCanvas } from './play-canvas'

const GamePlayStoreContext = createContext<GamePlayStore | null>(null)
export const useGamePlayStore = (): GamePlayStore => {
  const gamePlayStore = useContext(GamePlayStoreContext)
  if (!gamePlayStore) {
    throw new Error('You have forgotten to wrap game play screen component with GamePlayStoreProvider')
  }
  return gamePlayStore
}

export const GamePlayScreen: FC = observer(() => {
  const { appStore } = useStore()
  const gameStore = useGameStore()
  const [gamePlayStore] = useState(gameStore.createGamePlayStore)

  handleGamePlayScreenEsc({ gamePlayStore })

  return (
    <GamePlayStoreContext.Provider value={gamePlayStore}>
      <GameOpening isOpened={gameStore.opening.isOpened} />
      <PauseMenu isOpened={gamePlayStore.menuController.isGamePauseMenuOpened} />
      <SettingsMenu
        isOpened={gamePlayStore.menuController.isSettingsMenuOpened}
        onClose={gamePlayStore.menuController.closeCurrentMenu}
        afterClose={() => gamePlayStore.menuController.openMenu('pause')}
      />
      <QuitInMainMenuConfirm isOpened={appStore.isQuitInMainMenuConfirmOpened} />
      <PlayCanvas />
    </GamePlayStoreContext.Provider>
  )
})
