import { useEsc } from 'hooks/use-esc'

import { useGamePlayStore } from '../screen'

export const useGamePlayScreenEsc = (): void => {
  const gamePlayStore = useGamePlayStore()

  useEsc({
    defaultFn: () => {
      gamePlayStore.pauseController.toggleGamePause()
      gamePlayStore.menusController.toggle('pause')
    },
    variants: [
      {
        when: gamePlayStore.menusController.isSettingsMenuOpened,
        fn: () => {
          gamePlayStore.menusController.closeCurrentMenu()
          gamePlayStore.menusController.openMenu('pause')
        },
      },
    ],
    ignoreWhen: [gamePlayStore.opening.isOpened, gamePlayStore.textboxesController.isTextboxOpened],
  })
}
