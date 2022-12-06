import { ExpandedMovementDirection, PrimitiveMovementDirection, XY } from 'project-utility-types'

export const getMovementDirection = (start: XY, end: XY): ExpandedMovementDirection => {
  var direction: ExpandedMovementDirection = '' as ExpandedMovementDirection
  if (start.y < end.y) {
    direction += 'down'
  } else if (start.y > end.y) {
    direction += 'up'
  }

  if (start.x < end.x) {
    direction += 'right'
  } else if (start.x > end.x) {
    direction += 'left'
  }

  return direction as ExpandedMovementDirection
}

export const getReversedPrimitiveDirection = (
  direction: PrimitiveMovementDirection,
): PrimitiveMovementDirection => {
  if (direction === 'down') {
    return 'up'
  } else if (direction === 'right') {
    return 'left'
  } else if (direction === 'up') {
    return 'down'
  } else {
    return 'right'
  }
}
