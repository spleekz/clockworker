import { ExpandedMovementDirection, PrimitiveDirection, XY } from 'project-utility-types'

import { ViewDirections } from 'stores/entities/animation-controller'

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
  direction: PrimitiveDirection,
): PrimitiveDirection => {
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

export const convertMovementDirectionToViewDirection = (
  direction: ExpandedMovementDirection,
): ViewDirections => {
  return direction.includes('right')
    ? ViewDirections.RIGHT
    : direction.includes('left')
    ? ViewDirections.LEFT
    : direction.includes('down')
    ? ViewDirections.DOWN
    : ViewDirections.UP
}

export const convertExpandedMovementDirectionToPrimitive = (
  direction: ExpandedMovementDirection,
): PrimitiveDirection => {
  return direction.includes('right')
    ? 'right'
    : direction.includes('left')
    ? 'left'
    : direction.includes('down')
    ? 'down'
    : 'up'
}
