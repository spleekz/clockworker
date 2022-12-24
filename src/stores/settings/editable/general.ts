import { makeAutoObservable } from 'mobx'

import { SingleValueSetting } from 'stores/entities/editable-settings/single-value-setting'

export class GeneralAppSettings {
  constructor() {
    makeAutoObservable(this)
  }

  isGetUpdateNotifications = new SingleValueSetting('getUpdateNotification', true)
}
