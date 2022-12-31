import { makeAutoObservable } from 'mobx'

import { Popup } from './popup'

type PopupList = Record<string, Popup>

type PopupName<Popups extends PopupList> = keyof Popups

export class PopupsController<Popups extends PopupList> {
  private popups: Popups

  constructor(popups: Popups) {
    this.popups = popups

    makeAutoObservable(this)
  }

  get openedNames(): Array<PopupName<Popups>> {
    return Object.entries(this.popups).reduce((acc, [name, popup]) => {
      if (popup.isOpened) {
        acc.push(name)
      }
      return acc
    }, [] as Array<PopupName<Popups>>)
  }

  get openedPopups(): Array<Popup> {
    return this.openedNames.map((name) => this.popups[name])
  }

  open = (popupName: PopupName<Popups>): void => {
    this.popups[popupName].open()
  }

  close = (popupName: PopupName<Popups>): void => {
    this.popups[popupName].close()
  }

  closeAllOpened = (): void => {
    this.openedNames.forEach((name) => {
      this.close(name)
    })
  }

  toggle = (popupName: PopupName<Popups>): void => {
    this.popups[popupName].toggle()
  }

  isOpened = (popupName: PopupName<Popups>): boolean => {
    return this.popups[popupName].isOpened
  }

  get isAnyOpened(): boolean {
    return this.openedNames.length > 0
  }
}
