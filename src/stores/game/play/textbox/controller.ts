import { computed, makeObservable, observable } from 'mobx'

import { Callback, Properties } from 'basic-utility-types'

import { GameScript } from 'content/text/get-parsed-game-script'

import { GamePauseController } from '../pause-controller'
import { WelcomeTextbox } from './list/welcome'

type This = InstanceType<typeof TextboxesController>

type TextboxInController = InstanceType<Properties<This['refList']>>
type TextboxName = keyof This['refList']
type List = Record<TextboxName, TextboxInController>

type SetTextboxConfig = {
  name: TextboxName
  onOpen?: Callback
  onClose?: Callback
}

type TextboxesControllerConfig = {
  gameScript: GameScript
  pauseController: GamePauseController
}

export class TextboxesController {
  private gameScript: GameScript
  private pauseController: GamePauseController

  internalOnOpen: Callback
  internalOnClose: Callback

  constructor(config: TextboxesControllerConfig) {
    this.gameScript = config.gameScript
    this.pauseController = config.pauseController

    this.internalOnOpen = () => this.pauseController.onPause({ prohibitorName: 'textbox' })
    this.internalOnClose = () => this.pauseController.onResume({ prohibitorName: 'textbox' })

    makeObservable(this, { list: observable, currentTextbox: observable, isTextboxOpened: computed })
  }

  //Список текстбоксов, использующихся в контроллере
  private refList = { welcome: WelcomeTextbox }

  //Список созданных текстбоксов
  list: List = {} as List

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
