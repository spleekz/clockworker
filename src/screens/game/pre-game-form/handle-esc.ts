import { GamePlayStore } from 'stores/game/play/store'
import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

type Config = { gamePlayStore: GamePlayStore | null }
export const handlePreGameFormScreenEsc = (config: Config): void => {
  const { appStore } = useStore()
  const { gamePlayStore } = config

  useKey(
    {
      key: 'Escape',
      defaultFn: appStore.quitInMainMenuConfirm.toggle,
      ignoreWhen: gamePlayStore?.opening.isOpened,
    },
    [gamePlayStore],
  )
}
