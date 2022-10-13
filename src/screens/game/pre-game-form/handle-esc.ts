import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

import { useGameStore } from '../game'

export const handlePreGameFormScreenEsc = (): void => {
  const { appStore } = useStore()
  const gameStore = useGameStore()

  useKey({
    key: 'Escape',
    fn: () => {
      if (!gameStore.opening.isOpened) {
        appStore.toggleQuitInMainMenuConfirm()
      }
    },
  })
}
