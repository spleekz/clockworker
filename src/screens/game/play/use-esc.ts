import { useGameEsc } from 'hooks/use-game-esc'

import { useGamePlayStore } from '../screen'

export const useGamePlayScreenEsc = (): void => {
  const gamePlayStore = useGamePlayStore()

  useGameEsc({
    defaultFn: () => {
      gamePlayStore.pauseController.toggleGamePause()
      gamePlayStore.popups.controller.toggle('pauseMenu')
    },
    ignoreWhen: [gamePlayStore.opening.isOpened, gamePlayStore.textboxesController.isTextboxOpened],
  })
}
