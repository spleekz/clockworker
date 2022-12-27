import { useStore } from 'stores/root-store/context'

import { UseKeyConfig, UseKeyVariant, useKey } from './use-key'

type UseEscConfig = Omit<UseKeyConfig, 'key'>

export const useEsc = (
  { defaultFn, variants, ignoreWhen, element }: UseEscConfig,
  deps?: Array<any>,
): void => {
  const { appStore } = useStore()

  const popupOpenedVariant: UseKeyVariant = {
    when: appStore.popupsController.isAnyOpened,
    fn: appStore.popupsController.closeLastOpened,
  }

  useKey(
    {
      element,
      key: 'Escape',
      defaultFn,
      variants: [popupOpenedVariant, ...(variants ?? [])],
      ignoreWhen,
    },
    deps,
  )
}
