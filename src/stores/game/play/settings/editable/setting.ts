import { makeAutoObservable } from 'mobx'

import { EditableGameSettingVariant } from './settings'

type EditableGameSettingVariants<T> = Array<EditableGameSettingVariant<T>>

export class EditableGameSetting<Value> {
  variants: EditableGameSettingVariants<Value>

  constructor(variants: EditableGameSettingVariants<Value>) {
    this.variants = variants
    makeAutoObservable(this)
  }

  get value(): Value {
    const currentSettingVariant = this.variants.find(({ isSelected }) => isSelected)
    return currentSettingVariant!.value
  }

  selectVariant = (variantId: string): void => {
    this.variants.forEach((variant) => {
      if (variant.id === variantId) {
        variant.isSelected = true
      } else {
        variant.isSelected = false
      }
    })
  }
}
