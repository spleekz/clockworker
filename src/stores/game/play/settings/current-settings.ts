import { makeAutoObservable } from 'mobx'

import { GameSettingsList } from './settings-list'

export type MovementControllersKeys = {
  down: string
  right: string
  up: string
  left: string
}
export type MovementRegulatorsKeys = {
  sprint: string
}
export type MovementKeys = {
  controllers: MovementControllersKeys
  regulators: MovementRegulatorsKeys
}
type MovementSettings = { keys: MovementKeys }

type CurrentGameSettingsConfig = {
  gameSettingsList: GameSettingsList
}

export class CurrentGameSettings {
  private gameSettingsList: GameSettingsList

  constructor(config: CurrentGameSettingsConfig) {
    this.gameSettingsList = config.gameSettingsList

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Управление
  get movement(): MovementSettings {
    const controllers = this.gameSettingsList.controllers.movement.controllers.reduce(
      (acc, controllersVariant) => {
        if (controllersVariant.isSelected) {
          acc = controllersVariant.value
        }
        return acc
      },
      {} as MovementControllersKeys,
    )

    const regulators = {
      sprint: 'ShiftLeft',
    }

    return { keys: { controllers, regulators } }
  }
}
