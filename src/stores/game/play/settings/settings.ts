import { makeAutoObservable } from 'mobx'

import { AnyObject, DeepPartial } from 'basic-utility-types'
import { SettingValue } from 'project-utility-types/settings'

import { isObject, merge } from 'lib/objects'

import { EditableGameSetting } from './editable/setting'
import { EditableGameSettings } from './editable/settings'
import { InternalGameSettings } from './internal/settings'

export type MovementControllersKeys = {
  down: string
  right: string
  up: string
  left: string
}
export type MovementRegulatorsKeys = {
  sprint: string
}
export type GameSettingsMovementControls = {
  controllers: SettingValue<MovementControllersKeys>
  regulators: SettingValue<MovementRegulatorsKeys>
}
type GameSettingsControls = {
  movement: GameSettingsMovementControls
}

export type DeepPartialExcludeValue<T> = T extends AnyObject
  ? T extends SettingValue<unknown>
    ? T
    : { [K in keyof T]?: DeepPartialExcludeValue<T[K]> }
  : T

export type GameSettingsValues = {
  controls: GameSettingsControls
}
export type PartialGameSettingsValues = DeepPartialExcludeValue<GameSettingsValues>

export class GameSettings {
  constructor() {
    makeAutoObservable(this)
  }

  internal = new InternalGameSettings()
  editable = new EditableGameSettings()

  private get convertedEditableSettings(): DeepPartial<GameSettingsValues> {
    const convertedEditableSettings = {} as DeepPartial<GameSettingsValues>

    const isEditableSetting = (obj: AnyObject): obj is EditableGameSetting<unknown> => {
      return (
        (obj as EditableGameSetting<unknown>).variants !== undefined &&
        (obj as EditableGameSetting<unknown>).value !== undefined
      )
    }

    const checkObjectValuesForEditableSetting = (obj: AnyObject, target: AnyObject): void => {
      Object.keys(obj).forEach((key) => {
        if (isEditableSetting(obj[key])) {
          target[key] = { value: { ...obj[key].value } }
        } else {
          target[key] = { ...obj[key] }
          if (isObject(obj[key])) {
            checkObjectValuesForEditableSetting(obj[key], target[key])
          }
        }
      })
    }

    checkObjectValuesForEditableSetting(this.editable, convertedEditableSettings)
    return convertedEditableSettings
  }

  get current(): GameSettingsValues {
    return merge(this.internal, this.convertedEditableSettings) as GameSettingsValues
  }
}
