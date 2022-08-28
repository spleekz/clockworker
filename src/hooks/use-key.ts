import { useEffect } from 'react'

import { Callback } from 'basic-utility-types'

type UseKeyConfig = {
  element?: HTMLElement | Window | null
  key: string
  fn: Callback
}

const isWindow = (element: unknown): element is Window => {
  return element === window
}

export const useKey = ({ element = window, key, fn }: UseKeyConfig): void => {
  useEffect(() => {
    const onKeyDown = (e: Event): void => {
      const { code } = e as KeyboardEvent
      if (code === key) {
        fn()
      }
    }

    if (element) {
      if (!isWindow(element)) {
        element.tabIndex = 0
      }
      element.addEventListener('keydown', onKeyDown)
    }

    return () => element?.removeEventListener('keydown', onKeyDown)
  }, [element, fn])
}
