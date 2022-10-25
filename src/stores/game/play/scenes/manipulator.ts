import { OptionalProperties } from 'basic-utility-types'
import { Size, XY } from 'project-utility-types'

import { CharacterName, CharactersList } from '../characters/controller'

type PositionOnScene = { x: 'left' | 'right' | 'center'; y: 'top' | 'down' | 'center' }

type CharacterPositionOnMap = OptionalProperties<XY> | OptionalProperties<PositionOnScene>
const isPositionOnScene = (
  position: CharacterPositionOnMap,
): position is OptionalProperties<PositionOnScene> => {
  return typeof position.x === 'string' || typeof position.y === 'string'
}

type SceneCharactersManipulatorConfig = {
  mapSize: Size
  characterList: CharactersList
}
export class SceneCharactersManipulator {
  private mapSize: Size
  private characterList: CharactersList

  constructor(config: SceneCharactersManipulatorConfig) {
    this.mapSize = config.mapSize
    this.characterList = config.characterList
  }

  positionCharacter = (characterName: CharacterName, position: CharacterPositionOnMap): void => {
    const character = this.characterList[characterName]

    var x = character.position.x
    var y = character.position.y

    if (isPositionOnScene(position)) {
      const leftmostX = 0
      const rightmostX = this.mapSize.width - character.size.width
      const topmostY = 0
      const downmostY = this.mapSize.height - character.size.height
      const centerX = (rightmostX - leftmostX) / 2
      const centerY = (downmostY - topmostY) / 2

      if (position.x) {
        if (position.x === 'left') {
          x = leftmostX
        } else if (position.x === 'center') {
          x = centerX
        } else if (position.x === 'right') {
          x = rightmostX
        }
      }
      if (position.y) {
        if (position.y === 'top') {
          y = topmostY
        } else if (position.y === 'center') {
          y = centerY
        } else if (position.y === 'down') {
          y = downmostY
        }
      }
    }

    character.position.setXY(x, y)
  }
}
