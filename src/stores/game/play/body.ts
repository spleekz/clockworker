import { Size } from 'game-utility-types'
import { nanoid } from 'nanoid'

import { Position } from 'stores/entities/position'

export class Body {
  readonly id = nanoid(6)

  size: Size = { width: 0, height: 0 }
  setSize = (size: Size): void => {
    this.size = size
  }

  position = new Position()
}
