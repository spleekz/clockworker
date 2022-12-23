import { AnyObject } from 'basic-utility-types'
import { SettingValue } from 'project-utility-types/settings'

import { GameSettingsValues, PartialGameSettingsValues } from '../settings'
import { EditableGameSettingsControlsSection } from './sections/controls'
import { EditableGameSetting } from './setting'

type DeepMakeEditableIfSettingValue<T> = T extends AnyObject
  ? T extends SettingValue<infer SV>
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

// настройки, которые могут изменяться пользователем
export class EditableGameSettings implements PartialEditableGameSettingsValues {
  controls = new EditableGameSettingsControlsSection()
}
