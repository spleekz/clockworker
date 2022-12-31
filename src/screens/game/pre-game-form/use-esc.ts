import { GamePlayStore } from 'stores/game/play/store'
import { useStore } from 'stores/root-store/context'

import { useAppEsc } from 'hooks/use-app-esc'

type Config = { gamePlayStore: GamePlayStore | null }

export const usePreGameFormScreenEsc = (config: Config): void => {
  const { appStore } = useStore()
  const { gamePlayStore } = config

  useAppEsc(
    {
      defaultFn: () => appStore.popupsController.toggle('quitInMainMenuConfirm'),
      ignoreWhen: gamePlayStore?.opening.isOpened,
    },
    [gamePlayStore],
  )
}
