import { useStore } from 'stores/root-store/context'

import { useAppEsc } from 'hooks/use-app-esc'

export const useMainScreenEsc = (): void => {
  const { appStore } = useStore()

  useAppEsc({
    defaultFn: () => appStore.popupsController.toggle('quitGameConfirm'),
  })
}
