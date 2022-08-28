import { GamePlayStore } from 'stores/game/play/store'
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
        if (!gamePlayStore.textboxController.isTextboxOpened) {
          if (appStore.isQuitGameConfirmOpened) {
            appStore.closeQuitGameConfirm()
          } else if (appStore.isQuitInMainMenuConfirmOpened) {
            appStore.closeQuitInMainMenuConfirm()
          } else if (gamePlayStore.menuController.isSettingsMenuOpened) {
            gamePlayStore.menuController.closeCurrentMenu()
            gamePlayStore.menuController.openMenu('pause')
          } else {
            gamePlayStore.pauseController.toggleGamePause()
            gamePlayStore.menuController.toggle('pause')
          }
        }
      }
    },
  })
}
