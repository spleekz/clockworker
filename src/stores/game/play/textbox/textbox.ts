import { Callback } from 'basic-utility-types'

type TextboxConfig<Name extends string> = {
  name: Name
  text: string
  onOpen?: Callback
  onClose?: Callback
}
export class Textbox<TextboxName extends string> {
  name: TextboxName
  text: string

  constructor(config: TextboxConfig<TextboxName>) {
    this.name = config.name
    this.text = config.text

    this.setCallbacks({ onOpen: config.onOpen, onClose: config.onClose })
  }

  onOpen?: Callback
  onClose?: Callback
  setCallbacks = ({ onOpen, onClose }: { onOpen?: Callback; onClose?: Callback }): void => {
    this.onOpen = onOpen
    this.onClose = onClose
  }
}
