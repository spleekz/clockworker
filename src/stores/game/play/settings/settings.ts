import { makeAutoObservable } from 'mobx'

import { AnyObject, DeepPartial } from 'basic-utility-types'
import { SettingValue } from 'project-utility-types/settings'

import { getConvertedEditableSettings } from 'stores/lib/settings'

import { merge } from 'lib/objects'

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
    return getConvertedEditableSettings(this.editable)
  }

  get current(): GameSettingsValues {
    return merge(this.internal, this.convertedEditableSettings) as GameSettingsValues
  }
}
