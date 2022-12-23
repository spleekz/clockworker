import { makeAutoObservable } from 'mobx'

import { EditableSettingVariants } from 'project-utility-types/settings'

export class EditableGameSetting<Value> {
  variants: EditableSettingVariants<Value>

  constructor(variants: EditableSettingVariants<Value>) {
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
