import { useStore } from 'stores/root-store/context'

import { useGamePlayStore } from 'screens/game/screen'

import { UseAppEscConfig, useAppEsc } from './use-app-esc'
import { UseKeyVariant } from './use-key'

export const useGameEsc = (
  { defaultFn, variants, ignoreWhen, element }: UseAppEscConfig,
  deps?: Array<any>,
): void => {
  const { appStore } = useStore()
  const gamePlayStore = useGamePlayStore()

  const gamePopupOpenedVariant: UseKeyVariant = {
    // приоритетно закрытие попапа приложения
    when: !appStore.popupsController.isAnyOpened && gamePlayStore.popups.controller.isAnyOpened,
    fn: gamePlayStore.popups.controller.closeAllOpened,
  }

  useAppEsc(
    {
      element,
      defaultFn,
      variants: [gamePopupOpenedVariant, ...(variants ?? [])],
      ignoreWhen,
    },
    deps,
  )
}
