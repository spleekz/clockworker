import { DeepPartial } from 'basic-utility-types'

import { GameSettingsValues } from '../settings'
import { InternalGameSettingsControlsSection } from './sections/controls'

type InternalGameSettingsType = DeepPartial<GameSettingsValues>

export class InternalGameSettings implements InternalGameSettingsType {
  controls = new InternalGameSettingsControlsSection()
}
