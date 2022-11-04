import { MovementControllersKeys } from '../../settings'
import { EditableGameSetting } from '../setting'
import { DeepPartialExcludeEditableGameSetting, EditableGameSettingsValues } from '../settings'

type EditableSettingsControlsSection = DeepPartialExcludeEditableGameSetting<
  EditableGameSettingsValues['controls']
>

type EditableMovementControls = EditableSettingsControlsSection['movement']

export class EditableGameSettingsControlsSection {
  movement: EditableMovementControls = {
    controllers: new EditableGameSetting<MovementControllersKeys>([
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
    ]),
  }
}
