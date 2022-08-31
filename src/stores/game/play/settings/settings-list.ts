import { makeAutoObservable } from 'mobx'

import { MovementControllersKeys } from './current-settings'

type Setting<T> = {
  id: string
  label: string
  value: T
  isSelected: boolean
}

type Controllers = {
  movement: {
    controllers: Array<Setting<MovementControllersKeys>>
  }
}

export class GameSettingsList {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  controllers: Controllers = {
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
