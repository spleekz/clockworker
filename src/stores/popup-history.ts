import { makeAutoObservable } from 'mobx'

import { countOf } from 'lib/arrays'

import { Popup } from './entities/popup'

export type OpenHistoryNote = {
  popup: Popup
  event: 'open'
  forwardedFrom: Popup | null
}

export type CloseHistoryNote = {
  popup: Popup
  event: 'close'
}

type HistoryNote = OpenHistoryNote | CloseHistoryNote

type CreateOpenNoteConfig = Pick<OpenHistoryNote, 'popup' | 'forwardedFrom'>
type CreateCloseNoteConfig = Pick<CloseHistoryNote, 'popup'>

export class PopupHistory {
  constructor() {
    makeAutoObservable(this)
  }

  notes: Array<HistoryNote> = []

  createOpenNote = ({ popup, forwardedFrom }: CreateOpenNoteConfig): void => {
    this.notes.push({
      popup,
      event: 'open',
      forwardedFrom,
    })
  }

  createCloseNote = ({ popup }: CreateCloseNoteConfig): void => {
    this.notes.push({
      popup,
      event: 'close',
    })
  }

  getLastUnclosedPopup = (): Popup | null => {
    return (
      this.notes.findLast((note) => {
        const openedCount = countOf(
          this.notes,
          ({ event, popup }) => popup.name === note.popup.name && event === 'open',
        )
        const closedCount = countOf(
          this.notes,
          ({ event, popup }) => popup.name === note.popup.name && event === 'close',
        )
        return openedCount > closedCount
      }).popup ?? null
    )
  }

  getUnclosedPopups = (): Array<Popup> => {
    return this.notes.reduce((acc, note) => {
      const openedCount = countOf(
        this.notes,
        ({ event, popup }) => popup.name === note.popup.name && event === 'open',
      )
      const closedCount = countOf(
        this.notes,
        ({ event, popup }) => popup.name === note.popup.name && event === 'close',
      )
      if (acc.every((p) => p.name !== note.popup.name) && openedCount > closedCount) {
        acc.push(note.popup)
      }
      return acc
    }, [] as Array<Popup>)
  }

  get isOpenedPopups(): boolean {
    const openNoteCount = countOf(this.notes, ({ event }) => event === 'open')
    const closeNoteCount = countOf(this.notes, ({ event }) => event === 'close')
    return openNoteCount !== closeNoteCount
  }
}
