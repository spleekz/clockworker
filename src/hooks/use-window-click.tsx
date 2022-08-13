import { useEffect } from 'react'

import { EmptyFunction } from 'basic-utility-types'

export const useWindowClick = (fn: EmptyFunction): void => {
  useEffect(() => {
    window.addEventListener('click', fn)
    return () => window.removeEventListener('click', fn)
  }, [fn])
}
