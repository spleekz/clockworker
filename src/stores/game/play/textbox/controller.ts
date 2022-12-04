import { makeAutoObservable, observable } from 'mobx'

import { Callback, Properties } from 'basic-utility-types'

import { GameScript } from 'content/text/get-parsed-game-script'

import { SharedPlayMethods } from '../shared-methods/shared-methods'
import { WelcomeTextbox } from './list/welcome'

type This = InstanceType<typeof TextboxController>

type TextboxInController = InstanceType<Properties<This['refList']>>
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

  //Список текстбоксов, использующихся в контроллере
  refList = { welcome: WelcomeTextbox }

  constructor(config: TextboxControllerConfig) {
    this.gameScript = config.gameScript
    this.sharedPlayMethods = config.sharedPlayMethods

    makeAutoObservable(this, { refList: observable.shallow })
  }

  //Список созданных текстбоксов
  list: List = {} as List

  internalOnOpen = (): void => {
    this.sharedPlayMethods.playerCharacter.addMovementKeysProhibitor('textbox')
    this.sharedPlayMethods.playerCharacter.pauseAutomove()
  }
  internalOnClose = (): void => {
    this.sharedPlayMethods.playerCharacter.removeMovementKeysProhibitor('textbox')
    this.sharedPlayMethods.playerCharacter.resumeAutomove()
  }

  createTextbox = (name: TextboxName): void => {
    this.list[name] = new this.refList[name]({ gameScript: this.gameScript })
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
