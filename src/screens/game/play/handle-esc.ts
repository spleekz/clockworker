import { GamePlayStore } from 'stores/game/play/game-play.store'
import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

import { useGameStore } from '../game'

type Config = {
  gamePlayStore: GamePlayStore
}

export const handleGamePlayScreenEsc = ({ gamePlayStore }: Config): void => {
  const { appStore } = useStore()
  const gameStore = useGameStore()

  useKey({
    key: 'Escape',
    fn: () => {
      if (!gameStore.opening.isOpening) {
        if (!gamePlayStore.isTextboxOpened) {
          if (appStore.isQuitGameConfirmOpened) {
            appStore.closeQuitGameConfirm()
          } else if (appStore.isQuitInMainMenuConfirmOpened) {
            appStore.closeQuitInMainMenuConfirm()
          } else if (gamePlayStore.isSettingsMenuOpened) {
            gamePlayStore.closeSettingsMenu()
            gamePlayStore.openGamePauseMenu()
          } else {
            gamePlayStore.toggleGamePause()
            gamePlayStore.toggleGamePauseMenu()
          }
        }
      }
    },
  })
}
