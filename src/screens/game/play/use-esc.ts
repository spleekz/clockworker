import { useEsc } from 'hooks/use-esc'

import { useGamePlayStore } from '../screen'

export const useGamePlayScreenEsc = (): void => {
  const gamePlayStore = useGamePlayStore()

  useEsc({
    fn: () => {
      gamePlayStore.popups.controller.toggle('pauseMenu')
    },
    ignoreWhen: [gamePlayStore.opening.isOpened, gamePlayStore.textboxesController.isTextboxOpened],
  })
}
