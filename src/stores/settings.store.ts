import { makeAutoObservable } from 'mobx'

type Setting<T> = {
  id: string
  label: string
  value: T
  isSelected: boolean
}

export type MovementControlValue = {
  down: string
  right: string
  up: string
  left: string
}

type Settings = {
  controls: {
    movementControls: Array<Setting<MovementControlValue>>
  }
}

export class SettingsStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  settings: Settings = {
    controls: {
      movementControls: [
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

  selectMovementControlVariant(id: string): void {
    this.settings.controls.movementControls.forEach((variant) => {
      if (variant.id === id) {
        variant.isSelected = true
      } else {
        variant.isSelected = false
      }
    })
  }
  get movementControlValue(): MovementControlValue {
    return this.settings.controls.movementControls.reduce((acc, variant) => {
      if (variant.isSelected) {
        acc = variant.value
      }
      return acc
    }, {} as MovementControlValue)
  }
}
