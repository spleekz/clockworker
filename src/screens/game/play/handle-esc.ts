import { GamePlayStore } from 'stores/game/play/store'
import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

type Config = {
  gamePlayStore: GamePlayStore
}

export const handleGamePlayScreenEsc = ({ gamePlayStore }: Config): void => {
  const { appStore } = useStore()

  useKey({
    key: 'Escape',
    fn: () => {
      if (!gamePlayStore.opening.isOpened) {
        if (!gamePlayStore.textboxesController.isTextboxOpened) {
          if (appStore.isQuitGameConfirmOpened) {
            appStore.closeQuitGameConfirm()
          } else if (appStore.isQuitInMainMenuConfirmOpened) {
            appStore.closeQuitInMainMenuConfirm()
          } else if (gamePlayStore.menusController.isSettingsMenuOpened) {
            gamePlayStore.menusController.closeCurrentMenu()
            gamePlayStore.menusController.openMenu('pause')
          } else {
            gamePlayStore.pauseController.toggleGamePause()
            gamePlayStore.menusController.toggle('pause')
          }
        }
      }
    },
  })
}
