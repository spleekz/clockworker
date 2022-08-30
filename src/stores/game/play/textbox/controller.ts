import { makeAutoObservable } from 'mobx'

import { Callback } from 'basic-utility-types'

import { GameScript } from 'content/text/get-parsed-game-script'

import { createWelcomeTextbox } from './list/welcome'

type TextboxControllerConfig = {
  gameScript: GameScript
}

export class TextboxController {
  private gameScript: GameScript

  private fnsForCreatingUsedTextboxes = [createWelcomeTextbox]

  list: Record<
    ReturnType<InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]>['name'],
    ReturnType<InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]>
  >

  constructor(config: TextboxControllerConfig) {
    this.gameScript = config.gameScript

    this.list = this.fnsForCreatingUsedTextboxes.reduce((acc, createTextbox) => {
      const textbox = createTextbox({ gameScript: this.gameScript })
      acc[textbox.name] = textbox
      return acc
    }, {} as Record<ReturnType<InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]>['name'], ReturnType<InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]>>)

    makeAutoObservable(this)
  }

  currentTextbox: ReturnType<
    InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]
  > | null = null
  setCurrentTextbox({
    name,
    onOpen,
    onClose,
  }: {
    name: ReturnType<
      InstanceType<typeof TextboxController>['fnsForCreatingUsedTextboxes'][number]
    >['name']
    onOpen?: Callback
    onClose?: Callback
  }): void {
    this.currentTextbox = this.list[name]
    this.currentTextbox.setCallbacks({ onOpen, onClose })
    this.currentTextbox.onOpen?.()
  }
  closeCurrentTextbox(): void {
    if (this.currentTextbox) {
      this.currentTextbox.onClose?.()
    }
    this.currentTextbox = null
  }

  get isTextboxOpened(): boolean {
    return Boolean(this.currentTextbox)
  }
}
