import { useEffect } from 'react'

import { Callback } from 'basic-utility-types'

export const useWindowClick = (fn: Callback): void => {
  useEffect(() => {
    window.addEventListener('click', fn)
    return () => window.removeEventListener('click', fn)
  }, [fn])
}
