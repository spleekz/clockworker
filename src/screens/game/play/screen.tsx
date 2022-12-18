import { observer } from 'mobx-react-lite'
import React, { createContext, useContext } from 'react'

import { FC } from 'basic-utility-types'

import { GamePlayStore } from 'stores/game/play/store'
import { useStore } from 'stores/root-store/context'

import { QuitInMainMenuConfirm } from 'components/popup/game-popups/quit-in-main-menu-confirm'

import { GameOpening } from '../opening'
import { handleGamePlayScreenEsc } from './handle-esc'
import { PauseMenu } from './pause-menu'
import { PlayCanvas } from './play-canvas/canvas'
import { GameSettingsMenu } from './settings/menu'

const GamePlayStoreContext = createContext<GamePlayStore | null>(null)
export const useGamePlayStore = (): GamePlayStore => {
  const gamePlayStore = useContext(GamePlayStoreContext)
  if (!gamePlayStore) {
    throw new Error('You have forgotten to wrap game play screen component with GamePlayStoreProvider')
  }
  return gamePlayStore
}

type Props = {
  gamePlayStore: GamePlayStore
}
export const GamePlayScreen: FC<Props> = observer(({ gamePlayStore }) => {
  const { appStore } = useStore()

  handleGamePlayScreenEsc({ gamePlayStore })

  return (
    <GamePlayStoreContext.Provider value={gamePlayStore}>
      <GameOpening />
      <PauseMenu isOpened={gamePlayStore.menusController.isGamePauseMenuOpened} />
      <GameSettingsMenu
        isOpened={gamePlayStore.menusController.isSettingsMenuOpened}
        onClose={gamePlayStore.menusController.closeCurrentMenu}
        afterClose={() => gamePlayStore.menusController.openMenu('pause')}
      />
      <QuitInMainMenuConfirm isOpened={appStore.isQuitInMainMenuConfirmOpened} />
      <PlayCanvas />
    </GamePlayStoreContext.Provider>
  )
})
