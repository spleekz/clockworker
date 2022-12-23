import { AnyObject } from 'basic-utility-types'
import { SettingValue } from 'project-utility-types/settings'

import { AnyEditableSetting, EditableSetting } from 'stores/entities/editable-settings/types'

import { PartialGameSettingsValues } from '../settings'
import { EditableGameSettingsControlsSection } from './sections/controls'

type DeepMakeEditableIfSettingValue<T> = T extends AnyObject
  ? T extends SettingValue<infer SV>
    ? EditableSetting<SV>
    : { [K in keyof T]: DeepMakeEditableIfSettingValue<T[K]> }
  : T

type PartialEditableGameSettingsValues = DeepMakeEditableIfSettingValue<PartialGameSettingsValues>

export type DeepPartialExcludeEditableGameSetting<T> = T extends AnyObject
  ? T extends AnyEditableSetting
    ? T
    : { [K in keyof T]?: DeepPartialExcludeEditableGameSetting<T[K]> }
  : T

// настройки, которые могут изменяться пользователем
export class EditableGameSettings implements PartialEditableGameSettingsValues {
  controls = new EditableGameSettingsControlsSection()
}
