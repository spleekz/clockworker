import { useStore } from 'stores/root-store/context'

import { UseKeyConfig, UseKeyVariant, useKey } from './use-key'

export type UseAppEscConfig = Omit<UseKeyConfig, 'key'>

export const useAppEsc = (
  { defaultFn, variants, ignoreWhen, element }: UseAppEscConfig,
  deps?: Array<any>,
): void => {
  const { appStore } = useStore()

  const appPopupOpenedVariant: UseKeyVariant = {
    when: appStore.popupsController.isAnyOpened,
    fn: appStore.popupsController.closeAllOpened,
  }

  useKey(
    {
      element,
      key: 'Escape',
      defaultFn,
      variants: [appPopupOpenedVariant, ...(variants ?? [])],
      ignoreWhen,
    },
    deps,
  )
}
