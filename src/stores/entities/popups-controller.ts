import { makeAutoObservable } from 'mobx'

import { last } from 'lib/arrays'

import { Popup } from './popup'

type PopupList = Record<string, Popup>

type PopupName<Popups extends PopupList> = keyof Popups

export class PopupsController<Popups extends PopupList> {
  private popups: Popups

  constructor(popups: Popups) {
    this.popups = popups

    makeAutoObservable(this)
  }

  // не использую геттер, так как нужно знать,
  // в каком порядке открывались попапы
  openedNames: Array<PopupName<Popups>> = []
  addOpened = (name: PopupName<Popups>): void => {
    this.openedNames.push(name)
  }
  removeOpened = (name: PopupName<Popups>): void => {
    this.openedNames = this.openedNames.filter((n) => n !== name)
  }
  get openedPopups(): Array<Popup> {
    return this.openedNames.map((name) => this.popups[name])
  }

  open = (popupName: PopupName<Popups>): void => {
    this.popups[popupName].open()
    this.addOpened(popupName)
  }

  close = (popupName: PopupName<Popups>): void => {
    this.popups[popupName].close()
    this.removeOpened(popupName)
  }

  closeLastOpened = (): void => {
    const lastOpenedName = last(this.openedNames)
    this.close(lastOpenedName)
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
