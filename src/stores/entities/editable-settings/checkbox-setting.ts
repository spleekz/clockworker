import { makeAutoObservable } from 'mobx'

import { EditableSettingVariants } from './types'

// одновременно можно выбрать несколько вариантов
export class CheckboxSetting<Value> {
  id: string
  variants: EditableSettingVariants<Value>

  constructor(id: string, variants: EditableSettingVariants<Value>) {
    this.id = id
    this.variants = variants

    makeAutoObservable(this)
  }

  get value(): Array<Value> {
    return this.variants.reduce((acc, variant) => {
      if (variant.isSelected) {
        acc.push(variant.value)
      }
      return acc
    }, [] as Array<Value>)
  }

  selectVariant = (variantId: string): void => {
    this.variants.forEach((variant) => {
      if (variant.id === variantId) {
        variant.isSelected = true
      }
    })
  }

  unselectVariant = (variantId: string): void => {
    this.variants.forEach((variant) => {
      if (variant.id === variantId) {
        variant.isSelected = false
      }
    })
  }
}
