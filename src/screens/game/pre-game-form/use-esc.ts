import { GamePlayStore } from 'stores/game/play/store'
import { useStore } from 'stores/root-store/context'

import { useEsc } from 'hooks/use-esc'

type Config = { gamePlayStore: GamePlayStore | null }

export const usePreGameFormScreenEsc = (config: Config): void => {
  const { appStore } = useStore()
  const { gamePlayStore } = config

  useEsc(
    {
      defaultFn: () => appStore.popupsController.toggle('quitInMainMenuConfirm'),
      ignoreWhen: gamePlayStore?.opening.isOpened,
    },
    [gamePlayStore],
  )
}
