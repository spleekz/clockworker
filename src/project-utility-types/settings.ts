export type SettingValue<T> = { value: T }

export type EditableSettingVariant<T> = {
  id: string
  label: string
  value: T
  isSelected: boolean
}

export type EditableSettingVariants<T> = Array<EditableSettingVariant<T>>
