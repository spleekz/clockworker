import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { QuitGameConfirm } from 'components/popup/game-popups/quit-game-confirm'
import { QuitInMainMenuConfirm } from 'components/popup/game-popups/quit-in-main-menu-confirm'

import { GameOpening } from '../opening'
import { useGamePlayStore, useGameStore } from '../screen'
import { PauseMenu } from './pause-menu'
import { PlayCanvas } from './play-canvas/canvas'
import { GameSettingsMenu } from './settings/menu'
import { useGamePlayScreenEsc } from './use-esc'

export const GamePlayScreen: FC = observer(() => {
  const gameStore = useGameStore()
  const gamePlayStore = useGamePlayStore()

  useGamePlayScreenEsc()

  return (
    <>
      <QuitGameConfirm onAccept={gameStore.endGame} />
      <QuitInMainMenuConfirm onAccept={gameStore.endGame} />

      <GameOpening />
      <PauseMenu isOpened={gamePlayStore.popups.controller.isOpened('pauseMenu')} />
      <GameSettingsMenu
        isOpened={gamePlayStore.popups.controller.isOpened('settingsMenu')}
        onClose={() => gamePlayStore.popups.controller.open('pauseMenu')}
      />
      <PlayCanvas />
    </>
  )
})
