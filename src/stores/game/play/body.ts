import { nanoid } from 'nanoid'
import { Size } from 'project-utility-types'

import { Position } from 'stores/entities/position'

export type BodyConfig = {
  is: string
}

export class Body {
  // показывает, чем является тело
  is: string

  constructor(config: BodyConfig) {
    const { is } = config
    this.is = is
  }

  readonly id = nanoid(6)

  size: Size = { width: 0, height: 0 }
  setSize = (size: Size): void => {
    this.size = size
  }

  position = new Position()
}
