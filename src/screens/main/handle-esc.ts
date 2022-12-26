import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

export const handleMainScreenEsc = (): void => {
  const { appStore } = useStore()

  useKey({
    key: 'Escape',
    defaultFn: () => appStore.popupsController.toggle('quitGameConfirm'),
    variants: [
      {
        when: appStore.popupsController.isAnyOpened,
        fn: appStore.popupsController.closeLastOpened,
      },
    ],
  })
}
