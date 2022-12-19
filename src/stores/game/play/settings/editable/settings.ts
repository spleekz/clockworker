import { AnyObject } from 'basic-utility-types'

import { GameSettingValue, GameSettingsValues, PartialGameSettingsValues } from '../settings'
import { EditableGameSettingsControlsSection } from './sections/controls'
import { EditableGameSetting } from './setting'

export type EditableGameSettingVariant<T> = {
  id: string
  label: string
  value: T
  isSelected: boolean
}

type DeepMakeEditableIfSettingValue<T> = T extends AnyObject
  ? T extends GameSettingValue<infer SV>
    ? EditableGameSetting<SV>
    : { [K in keyof T]: DeepMakeEditableIfSettingValue<T[K]> }
  : T

export type EditableGameSettingsValues = DeepMakeEditableIfSettingValue<GameSettingsValues>
export type PartialEditableGameSettingsValues =
  DeepMakeEditableIfSettingValue<PartialGameSettingsValues>

export type DeepPartialExcludeEditableGameSetting<T> = T extends AnyObject
  ? T extends EditableGameSetting<unknown>
    ? T
    : { [K in keyof T]?: DeepPartialExcludeEditableGameSetting<T[K]> }
  : T

// Настройки, которые могут изменяться пользователем
export class EditableGameSettings implements PartialEditableGameSettingsValues {
  controls = new EditableGameSettingsControlsSection()
}
