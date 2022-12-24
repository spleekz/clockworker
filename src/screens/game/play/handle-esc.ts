import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

import { useGamePlayStore } from '../screen'

export const handleGamePlayScreenEsc = (): void => {
  const { appStore } = useStore()
  const gamePlayStore = useGamePlayStore()

  useKey({
    key: 'Escape',
    fn: () => {
      if (!gamePlayStore.opening.isOpened) {
        if (!gamePlayStore.textboxesController.isTextboxOpened) {
          if (appStore.quitGameConfirm.isOpened) {
            appStore.quitGameConfirm.close()
          } else if (appStore.quitInMainMenuConfirm.isOpened) {
            appStore.quitInMainMenuConfirm.close()
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
