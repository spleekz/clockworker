import { makeAutoObservable } from 'mobx'

import { MovementControllersKeys } from './current-settings'

type Setting<T> = {
  id: string
  label: string
  value: T
  isSelected: boolean
}

type ControlsSettings = {
  movement: {
    controllers: Array<Setting<MovementControllersKeys>>
  }
}

//Изменяемые настройки (UI)
export class GameSettingsList {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  controls: ControlsSettings = {
    movement: {
      controllers: [
        {
          id: 'wasd',
          label: 'WASD',
          value: {
            down: 'KeyS',
            right: 'KeyD',
            up: 'KeyW',
            left: 'KeyA',
          },
          isSelected: true,
        },
        {
          id: 'arrows',
          label: 'Стрелочки',
          value: {
            down: 'ArrowDown',
            right: 'ArrowRight',
            up: 'ArrowUp',
            left: 'ArrowLeft',
          },
          isSelected: false,
        },
      ],
    },
  }

  selectSettingVariant(settingArray: Array<Setting<any>>, variantId: string): void {
    settingArray.forEach((variant) => {
      if (variant.id === variantId) {
        variant.isSelected = true
      } else {
        variant.isSelected = false
      }
    })
  }
}
