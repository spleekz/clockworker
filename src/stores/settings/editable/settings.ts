import { makeAutoObservable } from 'mobx'

import { GeneralAppSettings } from './general'

export class EditableAppSettings {
  constructor() {
    makeAutoObservable(this)
  }

  general = new GeneralAppSettings()
}
