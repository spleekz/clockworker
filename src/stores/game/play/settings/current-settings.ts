import { GameSettingList } from './setting-list'

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
  gameSettingList: GameSettingList
}

//Все настройки игры; объединение изменяемых и внутренних настроек
export class CurrentGameSettings {
  private gameSettingList: GameSettingList

  constructor(config: CurrentGameSettingsConfig) {
    this.gameSettingList = config.gameSettingList
  }

  //!Управление
  get movement(): MovementSettings {
    const controllers = this.gameSettingList.controls.movement.controllers.reduce(
      (acc, controllersVariant) => {
        if (controllersVariant.isSelected) {
          acc = controllersVariant.value
        }
        return acc
      },
      {} as MovementControllersKeys,
    )
    const regulators: MovementRegulatorsKeys = {
      sprint: 'ShiftLeft',
    }

    return { keys: { controllers, regulators } }
  }
}
