import { makeAutoObservable } from 'mobx'

type Setting<T> = {
  id: string
  label: string
  value: T
  isSelected: boolean
}

export type MovementControllers = {
  down: string
  right: string
  up: string
  left: string
}
export type MovementRegulators = {
  sprint: string
}
export type MovementKeys = {
  controllers: MovementControllers
  regulators: MovementRegulators
}

type Controllers = {
  movement: {
    controllers: Array<Setting<MovementControllers>>
  }
}

export class SettingsStore {
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

  selectMovementControllersVariant(id: string): void {
    this.controllers.movement.controllers.forEach((variant) => {
      if (variant.id === id) {
        variant.isSelected = true
      } else {
        variant.isSelected = false
      }
    })
  }

  get movementControllers(): MovementControllers {
    return this.controllers.movement.controllers.reduce((acc, controllersVariant) => {
      if (controllersVariant.isSelected) {
        acc = controllersVariant.value
      }
      return acc
    }, {} as MovementControllers)
  }

  get movementRegulators(): MovementRegulators {
    return {
      sprint: 'ShiftLeft',
    }
  }

  get movementKeys(): MovementKeys {
    return {
      controllers: this.movementControllers,
      regulators: this.movementRegulators,
    }
  }
}
