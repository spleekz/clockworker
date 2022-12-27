import { useStore } from 'stores/root-store/context'

import { useEsc } from 'hooks/use-esc'

export const useMainScreenEsc = (): void => {
  const { appStore } = useStore()

  useEsc({
    defaultFn: () => appStore.popupsController.toggle('quitGameConfirm'),
  })
}
