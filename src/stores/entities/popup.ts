import { makeAutoObservable } from 'mobx'

import { Callback } from 'basic-utility-types'

import { OpenHistoryNote, PopupHistory } from './popup-history'

export type PopupCallbackOptions = {
  overwrite?: boolean
}

type PopupCallbackInfo = {
  fn: Callback | null
  options?: PopupCallbackOptions
}

type PopupOnOpenConfig = {
  // попап, который закрылся и сразу открыл этот попап
  // к нему нужно будет вернуться после закрытия этого попапа
  forwardedFrom: {
    popup: Popup
    onClose: PopupCallbackInfo
  }
}

type PopupOpenParams = {
  onOpen?: PopupCallbackInfo
  config?: PopupOnOpenConfig
}

export type PopupToggleConfig = {
  onOpen?: PopupCallbackInfo
  onClose?: PopupCallbackInfo
}

type Config = {
  name: string
  onOpen?: Callback
  onClose?: Callback
  history: PopupHistory
}

export class Popup {
  name: string
  onOpen: Callback | null
  onClose: Callback | null
  private history: PopupHistory

  constructor(config: Config) {
    const { name, onOpen, onClose, history } = config ?? {}

    this.name = name
    this.setOnOpen(onOpen ?? null)
    this.setOnClose(onClose ?? null)
    this.history = history

    makeAutoObservable(this)
  }

  setOnOpen = (onOpen: Callback | null): void => {
    this.onOpen = onOpen
  }
  setOnClose = (onClose: Callback | null): void => {
    this.onClose = onClose
  }

  isOpened = false

  private openDirectly = (onOpen?: Callback | null, options?: PopupCallbackOptions): void => {
    this.isOpened = true

    const { overwrite = true } = options ?? {}

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

  // если onOpen / onClose === null - значит пустая функция,
  // а если undefined - значит будет использоваться функция по умолчанию
  open = (params?: PopupOpenParams): void => {
    const { onOpen, config } = params ?? {}

    const { forwardedFrom } = config ?? {}

    if (forwardedFrom) {
      const { fn, options } = forwardedFrom.onClose
      forwardedFrom.popup.close(fn, options)
    }

    const { fn, options } = onOpen ?? {}
    this.openDirectly(fn, options)

    this.history.createOpenNote({ popup: this, forwardedFrom: forwardedFrom?.popup ?? null })
  }

  private closeDirectly = (onClose?: Callback | null, options?: PopupCallbackOptions): void => {
    this.isOpened = false

    const { overwrite = true } = options ?? {}

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

  close = (onClose?: Callback | null, options?: PopupCallbackOptions): void => {
    this.closeDirectly(onClose, options)

    const lastNoteAboutPopupOpen: OpenHistoryNote = this.history.notes.findLast((note) => {
      return note.event === 'open' && note.popup.name === this.name
    }) as OpenHistoryNote

    const { event, forwardedFrom = null } = lastNoteAboutPopupOpen

    if (event === 'open' && forwardedFrom !== null) {
      forwardedFrom.open()
    }

    this.history.createCloseNote({ popup: this })
  }

  toggle = (config?: PopupToggleConfig): void => {
    const { onOpen, onClose } = config ?? {}

    if (!this.isOpened) {
      this.open({ onOpen })
    } else {
      this.close(onClose?.fn, onClose?.options)
    }
  }
}
