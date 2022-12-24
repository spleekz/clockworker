import { AnyObject } from 'basic-utility-types'
import { SettingValue } from 'project-utility-types/settings'

import { CheckboxSetting } from 'stores/entities/editable-settings/checkbox-setting'
import { RadioSetting } from 'stores/entities/editable-settings/radio-setting'
import { SingleValueSetting } from 'stores/entities/editable-settings/single-value-setting'
import { AnyEditableSetting, EditableSetting } from 'stores/entities/editable-settings/types'

import { isObject } from 'lib/objects'

export type DeepConvertEditableSettings<T extends AnyObject> = T extends EditableSetting<infer SV>
  ? SettingValue<SV>
  : { [K in keyof T]: DeepConvertEditableSettings<T[K]> }

export const isEditableSetting = (obj: AnyObject): obj is AnyEditableSetting => {
  return (
    (obj as AnyEditableSetting).id !== undefined &&
    (obj as AnyEditableSetting).value !== undefined &&
    ((obj as SingleValueSetting<any>).set !== undefined ||
      (obj as CheckboxSetting<any>).unselectVariant !== undefined ||
      (obj as RadioSetting<any>).selectVariant !== undefined)
  )
}

export const getConvertedEditableSettings = <T extends AnyObject>(
  object: T,
): DeepConvertEditableSettings<T> => {
  const convertedEditableSettings = {} as DeepConvertEditableSettings<T>

  const checkObjectValuesForEditableSetting = (obj: AnyObject, target: AnyObject): void => {
    Object.keys(obj).forEach((key) => {
      if (isEditableSetting(obj[key])) {
        if (isObject(obj[key].value)) {
          target[key] = { value: { ...obj[key].value } }
        } else {
          target[key] = { value: obj[key].value }
        }
      } else {
        target[key] = { ...obj[key] }
        if (isObject(obj[key])) {
          checkObjectValuesForEditableSetting(obj[key], target[key])
        }
      }
    })
  }

  checkObjectValuesForEditableSetting(object, convertedEditableSettings)

  return convertedEditableSettings
}
