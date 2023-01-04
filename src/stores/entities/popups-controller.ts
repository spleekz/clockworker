import { makeAutoObservable } from 'mobx'

import { Entries } from 'basic-utility-types'

import { OnCloseConfig, OnOpenConfig, closePopup, openPopup } from 'stores/lib/popups'

import { Popup, PopupToggleConfig } from './popup'
import { PopupHistory } from './popup-history'

type PopupList<PopupName extends string> = Record<PopupName, Popup>

export class PopupsController<PopupName extends string> {
  private popups: PopupList<PopupName>
  private history: PopupHistory

  constructor(popups: Record<PopupName, Popup>, history: PopupHistory) {
    this.popups = popups
    this.history = history

    makeAutoObservable(this)
  }

  get openedNames(): Array<PopupName> {
    return (Object.entries(this.popups) as Entries<PopupList<PopupName>>).reduce(
      (acc, [name, popup]) => {
        if (popup.isOpened) {
          acc.push(name)
        }
        return acc
      },
      [] as Array<PopupName>,
    )
  }

  get openedPopups(): Array<Popup> {
    return this.openedNames.map((name) => this.popups[name])
  }

  open = (popupName: PopupName, config?: OnOpenConfig): void => {
    const popup = this.popups[popupName]
    openPopup({ popup, config, history: this.history })
  }

  close = (popupName: PopupName, config?: OnCloseConfig): void => {
    const popup = this.popups[popupName]
    closePopup({ popup, config, history: this.history })
  }

  toggle = (popupName: PopupName, config?: PopupToggleConfig): void => {
    const popup = this.popups[popupName]

    const { onOpen, onClose } = config ?? {}

    if (!popup.isOpened) {
      this.open(popupName, onOpen)
    } else {
      this.close(popupName, onClose)
    }
  }

  isOpened = (popupName: PopupName): boolean => {
    return this.popups[popupName].isOpened
  }

  get isAnyOpened(): boolean {
    return this.openedNames.length > 0
  }
}
