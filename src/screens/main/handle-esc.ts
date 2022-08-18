import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

export const handleMainScreenEsc = (): void => {
  const { appStore } = useStore()

  useKey({
    key: 'Escape',
    fn: () => {
      if (appStore.isSettingsMenuOpened) {
        appStore.closeSettingsMenu()
      } else {
        appStore.toggleQuitGameConfirm()
      }
    },
  })
}