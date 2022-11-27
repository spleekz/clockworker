import { makeAutoObservable } from 'mobx'

import { Callback, UnionProperties } from 'basic-utility-types'

import { GameScript } from 'content/text/get-parsed-game-script'

import { SharedPlayMethods } from '../shared-methods/shared-methods'
import { createWelcomeTextbox } from './list/welcome'

type This = InstanceType<typeof TextboxController>

type TextboxInController = ReturnType<UnionProperties<This['refList']>>
type List = Record<keyof This['refList'], TextboxInController>
type TextboxName = keyof This['refList']

type SetTextboxConfig = {
  name: TextboxName
  onOpen?: Callback
  onClose?: Callback
}

type TextboxControllerConfig = {
  gameScript: GameScript
  sharedPlayMethods: SharedPlayMethods
}

export class TextboxController {
  private gameScript: GameScript
  private sharedPlayMethods: SharedPlayMethods

  private refList = { welcome: createWelcomeTextbox }

  list: List = {} as List

  constructor(config: TextboxControllerConfig) {
    this.gameScript = config.gameScript
    this.sharedPlayMethods = config.sharedPlayMethods

    makeAutoObservable(this)
  }

  internalOnOpen = (): void => {
    this.sharedPlayMethods.playerCharacter.stopHandlingMovementKeys()
  }
  internalOnClose = (): void => {
    this.sharedPlayMethods.playerCharacter.handleMovementKeys()
  }

  createTextbox = (name: TextboxName): void => {
    this.list[name] = this.refList[name]({ gameScript: this.gameScript })
  }

  currentTextbox: TextboxInController | null = null

  setCurrentTextbox = ({ name, onOpen, onClose }: SetTextboxConfig): void => {
    if (!this.list[name]) {
      this.createTextbox(name)
    }

    this.currentTextbox = this.list[name]
    this.internalOnOpen()
    this.currentTextbox.setCallbacks({ onOpen, onClose })
    this.currentTextbox.onOpen?.()
  }

  closeCurrentTextbox = (): void => {
    if (this.currentTextbox) {
      this.internalOnClose()
      this.currentTextbox.onClose?.()
    }
    this.currentTextbox = null
  }

  get isTextboxOpened(): boolean {
    return Boolean(this.currentTextbox)
  }
}
