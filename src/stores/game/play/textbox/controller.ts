import { makeAutoObservable } from 'mobx'

import { GameScript } from 'content/text/get-parsed-game-script'

import { GameActions } from '../game-actions'
import { createWelcomeTextbox } from './list/welcome'

type TextboxControllerConfig = {
  gameActions: GameActions
  gameScript: GameScript
}

export class TextboxController {
  private gameActions: GameActions
  private gameScript: GameScript

  private fnsForCreatingUsedTextboxes = [createWelcomeTextbox]

  list: Record<
    ReturnType<InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]>['name'],
    ReturnType<InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]>
  >

  constructor(config: TextboxControllerConfig) {
    this.gameActions = config.gameActions
    this.gameScript = config.gameScript

    this.list = this.fnsForCreatingUsedTextboxes.reduce((acc, createTextbox) => {
      const textbox = createTextbox({ gameActions: this.gameActions, gameScript: this.gameScript })
      acc[textbox.name] = textbox
      return acc
    }, {} as Record<ReturnType<InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]>['name'], ReturnType<InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]>>)

    makeAutoObservable(this)
  }

  currentTextbox: ReturnType<
    InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]
  > | null = null
  setCurrentTextbox(
    name: ReturnType<
      InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]
    >['name'],
  ): void {
    this.currentTextbox = this.list[name]
  }
  closeCurrentTextbox(): void {
    if (this.currentTextbox) {
      this.currentTextbox.afterClose?.()
    }
    this.currentTextbox = null
  }

  get isTextboxOpened(): boolean {
    return Boolean(this.currentTextbox)
  }
}
