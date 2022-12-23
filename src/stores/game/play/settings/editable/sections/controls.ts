import { RadioSetting } from 'stores/entities/editable-settings/radio-setting'

import { MovementControllersKeys } from '../../settings'

export class EditableGameSettingsControlsSection {
  movement = {
    controllers: new RadioSetting<MovementControllersKeys>('movementControllers', [
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
