import { makeAutoObservable } from 'mobx'

import { EditableSettingVariants } from './types'

// можно выбрать только один вариант
export class RadioSetting<Value> {
  id: string
  variants: EditableSettingVariants<Value>

  constructor(id: string, variants: EditableSettingVariants<Value>) {
    this.id = id
    this.variants = variants

    makeAutoObservable(this)
  }

  get value(): Value {
    return this.variants.find((v) => v.isSelected)!.value
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
