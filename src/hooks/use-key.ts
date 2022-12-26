import { useEffect } from 'react'

import { Callback } from 'basic-utility-types'

const isWindow = (element: unknown): element is Window => {
  return element === window
}

type IgnoreWhenValue = boolean | null | undefined

type Variant = {
  when: boolean
  fn: Callback
}

type UseKeyConfig = {
  element?: HTMLElement | Window | null
  key: string
  defaultFn: Callback
  variants?: Array<Variant>
  ignoreWhen?: IgnoreWhenValue | Array<IgnoreWhenValue>
}

export const useKey = (
  { element = window, key, defaultFn, variants, ignoreWhen }: UseKeyConfig,
  deps?: Array<any>,
): void => {
  const fn: Callback = () => {
    const isIgnore = Array.isArray(ignoreWhen) ? ignoreWhen.some(Boolean) : Boolean(ignoreWhen)

    if (!isIgnore) {
      var isVariantTriggered = false

      variants?.forEach((variant) => {
        if (variant.when) {
          variant.fn()
          isVariantTriggered = true
        }
      })

      if (!isVariantTriggered) {
        defaultFn()
      }
    }
  }

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
  }, [element, fn, ...(deps ?? [])])
}
