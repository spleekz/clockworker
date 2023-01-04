import { makeAutoObservable } from 'mobx'

import { countOf } from 'lib/arrays'

import { Popup } from './popup'

type OpenHistoryNote = {
  popup: Popup
  event: 'open'
  forwardedFrom: Popup | null
}

type CloseHistoryNote = {
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

  get isOpenedPopups(): boolean {
    const openNoteCount = countOf(this.notes, ({ event }) => event === 'open')
    const closeNoteCount = countOf(this.notes, ({ event }) => event === 'close')
    return openNoteCount !== closeNoteCount
  }
}
