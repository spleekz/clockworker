import { EmptyFunction } from 'basic-utility-types'

export class Textbox<TextboxName extends string> {
  name: TextboxName
  text: string
  afterClose: EmptyFunction | null

  constructor(config: { name: TextboxName; text: string; afterClose?: EmptyFunction }) {
    this.name = config.name
    this.text = config.text
    this.afterClose = config.afterClose ?? null
  }
}
