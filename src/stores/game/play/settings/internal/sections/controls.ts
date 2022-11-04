import { DeepPartialExcludeValue, GameSettingsValues } from '../../settings'

type SettingsControlsSection = DeepPartialExcludeValue<GameSettingsValues['controls']>

type MovementControls = SettingsControlsSection['movement']

export class InternalGameSettingsControlsSection implements SettingsControlsSection {
  movement: MovementControls = {
    regulators: {
      value: {
        sprint: 'ShiftLeft',
      },
    },
  }
}
