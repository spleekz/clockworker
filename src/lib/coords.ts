import { XY } from 'game-utility-types'

export const getDistanceBetweenPoints = (point1: XY, point2: XY): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
}
