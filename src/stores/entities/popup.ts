import { makeAutoObservable } from 'mobx'

import { Callback } from 'basic-utility-types'

export type PopupToggleConfig = {
  onOpen?: {
    fn: Callback | null
  } & PopupCallbackConfig
  onClose?: {
    fn: Callback | null
  } & PopupCallbackConfig
}

export type PopupCallbackConfig = {
  overwrite?: boolean
}

type Config = {
  onOpen?: Callback
  onClose?: Callback
}

export class Popup {
  onOpen: Callback | null
  onClose: Callback | null

  constructor(config?: Config) {
    const { onOpen, onClose } = config ?? {}
    this.setOnOpen(onOpen ?? null)
    this.setOnClose(onClose ?? null)

    makeAutoObservable(this)
  }

  setOnOpen = (onOpen: Callback | null): void => {
    this.onOpen = onOpen
  }
  setOnClose = (onClose: Callback | null): void => {
    this.onClose = onClose
  }

  isOpened = false

  // если onOpen / onClose === null - значит пустая функция,
  // а если undefined - значит будет использоваться функция по умолчанию
  open = (onOpen?: Callback | null, config?: PopupCallbackConfig): void => {
    this.isOpened = true

    const { overwrite = true } = config ?? {}

    if (onOpen !== undefined) {
      if (overwrite) {
        onOpen?.()
      } else {
        const newOnOpen = (): void => {
          this.onOpen?.()
          onOpen?.()
        }
        newOnOpen()
      }
    } else {
      this.onOpen?.()
    }
  }

  close = (onClose?: Callback | null, config?: PopupCallbackConfig): void => {
    this.isOpened = false

    const { overwrite = true } = config ?? {}

    if (onClose !== undefined) {
      if (overwrite) {
        onClose?.()
      } else {
        const newOnClose = (): void => {
          this.onClose?.()
          onClose?.()
        }
        newOnClose()
      }
    } else {
      this.onClose?.()
    }
  }

  toggle = (config?: PopupToggleConfig): void => {
    const { onOpen, onClose } = config ?? {}

    if (!this.isOpened) {
      const { fn, ...onOpenConfig } = onOpen ?? {}
      this.open(fn, onOpenConfig)
    } else {
      const { fn, ...onCloseConfig } = onClose ?? {}
      this.close(fn, onCloseConfig)
    }
  }
}
