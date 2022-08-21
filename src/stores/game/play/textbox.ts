import { makeAutoObservable } from 'mobx'

import { EmptyFunction } from 'basic-utility-types'

type TextboxCofig = {
  text: string
  afterClose: EmptyFunction
}

export class Textbox {
  text: string
  afterClose: EmptyFunction

  constructor(config: TextboxCofig) {
    Object.assign(this, config)

    makeAutoObservable(this)
  }
}
