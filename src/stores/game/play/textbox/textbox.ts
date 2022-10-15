import { Callback } from 'basic-utility-types'

export class Textbox<TextboxName extends string> {
  name: TextboxName
  text: string
  onOpen?: Callback
  onClose?: Callback

  constructor(config: { name: TextboxName; text: string; onOpen?: Callback; onClose?: Callback }) {
    this.name = config.name
    this.text = config.text
    this.onOpen = config.onOpen
    this.onClose = config.onClose
  }

  setCallbacks = ({ onOpen, onClose }: { onOpen?: Callback; onClose?: Callback }): void => {
    this.onOpen = onOpen
    this.onClose = onClose
  }
}
