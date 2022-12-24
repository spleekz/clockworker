import { makeAutoObservable } from 'mobx'

import { SettingValue } from 'project-utility-types/settings'

import { getConvertedEditableSettings } from 'stores/lib/settings'

import { EditableAppSettings } from './editable/settings'

type GeneralAppSettingsValues = {
  isGetUpdateNotifications: SettingValue<boolean>
}

export type AppSettingsValues = {
  general: GeneralAppSettingsValues
}

export class AppSettingsStore {
  constructor() {
    makeAutoObservable(this)
  }

  editable = new EditableAppSettings()

  get convertedSettings(): AppSettingsValues {
    return getConvertedEditableSettings(this.editable)
  }

  get current(): AppSettingsValues {
    return this.convertedSettings
  }
}
