import { Callback, PartialBy } from 'basic-utility-types'

import { Popup, PopupCallbackConfig } from 'stores/entities/popup'
import { PopupHistory } from 'stores/entities/popup-history'

import { countOf } from 'lib/arrays'

type CallbackConfig = PopupCallbackConfig & { fn: Callback | null }

export type OnOpenConfig = PartialBy<CallbackConfig, 'fn'> & {
  // попап, который закрылся и сразу открыл этот попап
  // к нему нужно будет вернуться после закрытия этого попапа
  forwardedFrom?: Popup | null
  onForwarderClose?: Callback | null
}
export type OnCloseConfig = CallbackConfig

type OpenPopupConfig = {
  popup: Popup
  config?: OnOpenConfig
  history: PopupHistory
}

type ClosePopupConfig = {
  popup: Popup
  config?: OnCloseConfig
  history: PopupHistory
}

export const openPopup = ({ popup, config, history }: OpenPopupConfig): void => {
  const { fn, forwardedFrom = null, onForwarderClose = null, ...onOpenConfig } = config ?? {}

  if (forwardedFrom) {
    const onForwarderCloseConfig: CallbackConfig | undefined =
      onForwarderClose !== undefined ? { fn: onForwarderClose } : undefined

    closePopup({ popup: forwardedFrom, config: onForwarderCloseConfig, history })
  }

  popup.open(fn, onOpenConfig)

  history.createOpenNote({ popup, forwardedFrom })
}

export const closePopup = ({ popup, config, history }: ClosePopupConfig): void => {
  const { fn, ...callbackConfig } = config ?? {}

  popup.close(fn, callbackConfig)

  const lastNoteAboutPopupOpen = history.notes.findLast((note) => {
    return note.event === 'open' && note.popup.name === popup.name
  })

  if (lastNoteAboutPopupOpen.event === 'open' && lastNoteAboutPopupOpen.forwardedFrom !== null) {
    openPopup({ popup: lastNoteAboutPopupOpen.forwardedFrom, history })
  }

  history.createCloseNote({ popup })
}

export const getLastUnclosedPopup = (history: PopupHistory): Popup | null => {
  return (
    history.notes.findLast((note) => {
      const openedCount = countOf(
        history.notes,
        ({ event, popup }) => popup.name === note.popup.name && event === 'open',
      )
      const closedCount = countOf(
        history.notes,
        ({ event, popup }) => popup.name === note.popup.name && event === 'close',
      )
      return openedCount > closedCount
    }).popup ?? null
  )
}

export const closeLastUnclosedPopup = (history: PopupHistory): void => {
  const lastUnclosedPopup = getLastUnclosedPopup(history)
  if (lastUnclosedPopup) {
    closePopup({ popup: lastUnclosedPopup, history })
  }
}

export const getUnclosedPopups = (history: PopupHistory): Array<Popup> => {
  return history.notes.reduce((acc, note) => {
    const openedCount = countOf(
      history.notes,
      ({ event, popup }) => popup.name === note.popup.name && event === 'open',
    )
    const closedCount = countOf(
      history.notes,
      ({ event, popup }) => popup.name === note.popup.name && event === 'close',
    )
    if (acc.every((p) => p.name !== note.popup.name) && openedCount > closedCount) {
      acc.push(note.popup)
    }
    return acc
  }, [] as Array<Popup>)
}

export const closeAllUnclosedPopups = (history: PopupHistory): void => {
  const unclosedPopups = getUnclosedPopups(history)
  unclosedPopups.forEach((popup) => closePopup({ popup, history }))
}
