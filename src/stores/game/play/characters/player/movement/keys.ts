import { PrimitiveDirection } from 'project-utility-types'

import { UsageController } from 'stores/entities/usage-controller'
import {
  GameSettings,
  GameSettingsMovementControls,
  MovementControllersKeys,
  MovementRegulatorsKeys,
} from 'stores/game/play/settings/settings'

import { last } from 'lib/arrays'

type Config = {
  settings: GameSettings
}
export class PlayerCharacterMovementKeys {
  private settings: GameSettings

  constructor(config: Config) {
    this.settings = config.settings
  }

  usageController = new UsageController()

  pressedKeys: Array<string> = []
  setPressedKeys = (keys: Array<string>): void => {
    this.pressedKeys = keys
  }

  get controls(): GameSettingsMovementControls {
    return this.settings.current.controls.movement
  }

  //!Контроллеры
  get controllerKeys(): MovementControllersKeys {
    return this.controls.controllers.value
  }
  isControllerKey = (key: string): boolean => {
    return Object.values(this.controllerKeys).some((controller) => key === controller)
  }

  get pressedControllers(): Array<string> {
    return this.pressedKeys.slice().reverse().filter(this.isControllerKey)
  }
  get pressedDirections(): Array<PrimitiveDirection> {
    return this.pressedControllers.map((controller) =>
      controller === this.controllerKeys.down
        ? 'down'
        : controller === this.controllerKeys.right
        ? 'right'
        : controller === this.controllerKeys.up
        ? 'up'
        : 'left',
    )
  }

  get isControllerPressed(): boolean {
    return this.pressedControllers.length !== 0
  }
  get isMoveDownControllerPressed(): boolean {
    return this.pressedControllers.includes(this.controllerKeys.down)
  }
  get isMoveRightControllerPressed(): boolean {
    return this.pressedControllers.includes(this.controllerKeys.right)
  }
  get isMoveUpControllerPressed(): boolean {
    return this.pressedControllers.includes(this.controllerKeys.up)
  }
  get isMoveLeftControllerPressed(): boolean {
    return this.pressedControllers.includes(this.controllerKeys.left)
  }

  //!Регуляторы
  get regulatorKeys(): MovementRegulatorsKeys {
    return this.controls.regulators.value
  }
  isRegulatorKey = (key: string): boolean => {
    return Object.values(this.regulatorKeys).some((regulator) => key === regulator)
  }

  get pressedRegulators(): Array<string> {
    return this.pressedKeys.filter(this.isRegulatorKey)
  }
  get isRegulatorKeysPressed(): boolean {
    return this.pressedRegulators.length > 0
  }
  get lastPressedRegulator(): string {
    return last(this.pressedRegulators)
  }

  get isSprintKeyPressed(): boolean {
    return this.lastPressedRegulator === this.regulatorKeys.sprint
  }
}
