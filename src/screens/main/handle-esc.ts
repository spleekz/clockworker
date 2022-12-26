import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

export const handleMainScreenEsc = (): void => {
  const { appStore } = useStore()

  useKey({
    key: 'Escape',
    defaultFn: appStore.quitGameConfirm.toggle,
    variants: [
      {
        when: appStore.settingsMenu.isOpened,
        fn: appStore.settingsMenu.close,
      },
    ],
  })
}
