import { AnyCharacter, ExpandedDirection, PointPair, Side, XY } from 'project-utility-types'

import { areEquivalent } from 'lib/are-equivalent'
import { removeOnce } from 'lib/arrays'
import { checkIntersection, getDistanceBetweenPoints } from 'lib/coords'

import { getMovementDirection } from '../lib/movement'
import { Body } from './body'
import { PlayerCharacter } from './characters/player/character'
import { GameScreen } from './screen'

type ColliderBody = Body | AnyCharacter | PlayerCharacter
type ColliderBodyWithHitbox = ColliderBody & { hitbox: PointPair }

type ColliderBodyWithHitboxAndStuckPlaces = ColliderBodyWithHitbox & { stuckPlaces: Array<string> }

const isCharacter = (body: ColliderBody): body is AnyCharacter => {
  return (body as AnyCharacter).movement !== undefined
}

export type HitboxWithId = { hitbox: PointPair; id: string }

type IntersectionPoint = { obstacleId: string; side: Side; point: XY }
type IntersectionPointWithDeltaLineLength = IntersectionPoint & { deltaLineLength: number }

type SetBodyToObstacleFn = (body: ColliderBodyWithHitbox, obstacle: PointPair) => void

type ColliderConfig = {
  screen: GameScreen
}

export class Collider {
  private screen: GameScreen

  constructor(config: ColliderConfig) {
    this.screen = config.screen
  }

  private bodies: Array<ColliderBodyWithHitbox> = []
  addBody = (body: Body): void => {
    const bodyWithHitbox: ColliderBodyWithHitbox = { ...body, hitbox: this.getBodyHitbox(body) }
    this.bodies.push(bodyWithHitbox)
  }
  addBodies = (bodies: Array<Body>): void => {
    bodies.forEach(this.addBody)
  }
  removeBody = (bodyId: string): void => {
    this.bodies = this.bodies.filter(({ id }) => id !== bodyId)
  }
  clearBodies = (): void => {
    this.bodies = []
  }

  private staticObstacles: Array<HitboxWithId> = []
  addStaticObstacle = (obstacle: HitboxWithId): void => {
    this.staticObstacles.push(obstacle)
  }
  addStaticObstacles = (obstacleHitboxes: Array<HitboxWithId>): void => {
    obstacleHitboxes.forEach(this.addStaticObstacle)
  }
  removeStaticObstacle = (obstacleId: string): void => {
    this.staticObstacles = this.staticObstacles.filter(({ id }) => id !== obstacleId)
  }
  clearStaticObstacles = (): void => {
    this.staticObstacles = []
  }

  clear = (): void => {
    this.clearBodies()
    this.clearStaticObstacles()
  }

  //! Вспомогательные функции
  getBodyHitbox = (body: ColliderBody): PointPair => {
    return {
      x1: body.position.x,
      y1: body.position.y,
      x2: body.position.x + body.size.width,
      y2: body.position.y + body.size.height,
    }
  }

  private getStaticObstacleById = (obstacleId: string): HitboxWithId => {
    return this.staticObstacles.find(({ id }) => id === obstacleId)!
  }

  private bodiesPrevHitboxes: Record<string, PointPair> = {}
  private setBodyPrevHitbox = (id: string, hitbox: PointPair): void => {
    this.bodiesPrevHitboxes[id] = hitbox
  }

  private getMovementDirectionByHitbox = (
    prevHitbox: PointPair,
    currentHitbox: PointPair,
  ): ExpandedDirection => {
    const start: XY = { x: prevHitbox.x1, y: prevHitbox.y1 }
    const end: XY = { x: currentHitbox.x1, y: currentHitbox.y1 }

    return getMovementDirection(start, end)
  }

  private getBottomHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x1,
      y1: hitbox.y2,
      x2: hitbox.x2,
      y2: hitbox.y2,
    }
  }
  private getRightHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x2,
      y1: hitbox.y1,
      x2: hitbox.x2,
      y2: hitbox.y2,
    }
  }
  private getTopHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x1,
      y1: hitbox.y1,
      x2: hitbox.x2,
      y2: hitbox.y1,
    }
  }
  private getLeftHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x1,
      y1: hitbox.y1,
      x2: hitbox.x1,
      y2: hitbox.y2,
    }
  }
  private getDeltaXHitbox = (prevHitbox: PointPair, currentHitbox: PointPair): PointPair => {
    return {
      x1: currentHitbox.x1,
      y1: prevHitbox.y1,
      x2: currentHitbox.x2,
      y2: prevHitbox.y2,
    }
  }
  private getDeltaYHitbox = (prevHitbox: PointPair, currentHitbox: PointPair): PointPair => {
    return {
      x1: prevHitbox.x1,
      y1: currentHitbox.y1,
      x2: prevHitbox.x2,
      y2: currentHitbox.y2,
    }
  }

  private isObstacleCornerPoint = (obstacle: PointPair, point: XY): boolean => {
    const cornerPoints: Array<XY> = [
      { x: obstacle.x1, y: obstacle.y1 },
      { x: obstacle.x2, y: obstacle.y1 },
      { x: obstacle.x2, y: obstacle.y2 },
      { x: obstacle.x1, y: obstacle.y2 },
    ]
    return cornerPoints.some((cornerPoint) => areEquivalent(point, cornerPoint))
  }

  private addBodyStuckPlace = (body: ColliderBodyWithHitboxAndStuckPlaces, place: string): void => {
    body.stuckPlaces.push(place)
  }
  private removeBodyStuckPlace = (body: ColliderBodyWithHitboxAndStuckPlaces, place: string): void => {
    body.stuckPlaces = removeOnce(body.stuckPlaces, place)
  }

  //! Получение дельта-линий
  private getDeltaLines = (
    prevHitbox: PointPair,
    currentHitbox: PointPair,
    step: number,
  ): Array<PointPair> => {
    const width = prevHitbox.x2 - prevHitbox.x1
    const height = prevHitbox.y2 - prevHitbox.y1

    const linesForWidth = Math.floor(width / step)
    const linesForHeight = Math.floor(height / step)
    const linesCount = 2 * (linesForWidth + linesForHeight)

    var currentSide = 0
    const deltaLines: Array<PointPair> = Array.from({ length: linesCount }, (_, index) => {
      if (currentSide === 0) {
        if (index < linesForWidth) {
          return {
            x1: prevHitbox.x1 + index * step,
            y1: prevHitbox.y1,
            x2: currentHitbox.x1 + index * step,
            y2: currentHitbox.y1,
          }
        } else {
          currentSide += 1
        }
      }
      if (currentSide === 1) {
        if (index < linesForWidth + linesForHeight) {
          return {
            x1: prevHitbox.x2,
            y1: prevHitbox.y1 + (index - linesForWidth) * step,
            x2: currentHitbox.x2,
            y2: currentHitbox.y1 + (index - linesForWidth) * step,
          }
        } else {
          currentSide += 1
        }
      }
      if (currentSide === 2) {
        if (index < 2 * linesForWidth + linesForHeight) {
          return {
            x1: prevHitbox.x2 - (index - linesForWidth - linesForHeight) * step,
            y1: prevHitbox.y2,
            x2: currentHitbox.x2 - (index - linesForWidth - linesForHeight) * step,
            y2: currentHitbox.y2,
          }
        } else {
          currentSide += 1
        }
      }
      if (currentSide === 3) {
        if (index < 2 * (linesForWidth + linesForHeight)) {
          return {
            x1: prevHitbox.x1,
            y1: prevHitbox.y2 - (index - 2 * linesForWidth - linesForHeight) * step,
            x2: currentHitbox.x1,
            y2: currentHitbox.y2 - (index - 2 * linesForWidth - linesForHeight) * step,
          }
        }
      }
    }) as Array<PointPair>

    return deltaLines
  }

  //! Определение точек пересечения
  private getIntersectionPointOfTwoLines = (line1: PointPair, line2: PointPair): XY | null => {
    const intersectionCheckResult = checkIntersection(line1, line2)
    if (intersectionCheckResult.type !== 'intersecting') {
      return null
    }
    return intersectionCheckResult.point
  }

  private getIntersectionPointsOfLineAndObstacle = (
    line: PointPair,
    obstacle: HitboxWithId,
  ): Array<IntersectionPoint> | null => {
    const obstacleHitbox = obstacle.hitbox
    const bottomObstacleLine = this.getBottomHitboxLine(obstacleHitbox)
    const rightObstacleLine = this.getRightHitboxLine(obstacleHitbox)
    const topObstacleLine = this.getTopHitboxLine(obstacleHitbox)
    const leftObstacleLine = this.getLeftHitboxLine(obstacleHitbox)

    const intersectionPoints: Array<IntersectionPoint> = []

    const bottomIntersectionPoint = this.getIntersectionPointOfTwoLines(line, bottomObstacleLine)
    if (bottomIntersectionPoint) {
      intersectionPoints.push({
        obstacleId: obstacle.id,
        side: 'bottom',
        point: bottomIntersectionPoint,
      })
    }

    const rightIntersectionPoint = this.getIntersectionPointOfTwoLines(line, rightObstacleLine)
    if (rightIntersectionPoint) {
      intersectionPoints.push({
        obstacleId: obstacle.id,
        side: 'right',
        point: rightIntersectionPoint,
      })
    }

    const topIntersectionPoint = this.getIntersectionPointOfTwoLines(line, topObstacleLine)
    if (topIntersectionPoint) {
      intersectionPoints.push({ obstacleId: obstacle.id, side: 'top', point: topIntersectionPoint })
    }

    const leftIntersectionPoint = this.getIntersectionPointOfTwoLines(line, leftObstacleLine)
    if (leftIntersectionPoint) {
      intersectionPoints.push({ obstacleId: obstacle.id, side: 'left', point: leftIntersectionPoint })
    }

    return intersectionPoints.length ? intersectionPoints : null
  }

  private getClosestIntersectionPoint = (
    deltaLine: PointPair,
    intersectionPoints: Array<IntersectionPoint>,
  ): IntersectionPointWithDeltaLineLength => {
    const deltaLineRoot: XY = { x: deltaLine.x1, y: deltaLine.y1 }
    const intersectionPointsWithDeltaLineLength: Array<IntersectionPointWithDeltaLineLength> =
      intersectionPoints.map((intersectionPoint) => ({
        ...intersectionPoint,
        deltaLineLength: getDistanceBetweenPoints(deltaLineRoot, intersectionPoint.point),
      }))

    intersectionPointsWithDeltaLineLength.sort((a, b) => a.deltaLineLength - b.deltaLineLength)
    return intersectionPointsWithDeltaLineLength[0]
  }

  private getDownmostIntersectionPoints = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points
      .filter(({ side }) => side === 'bottom' || side === 'top')
      .sort((a, b) => b.point.y - a.point.y)[0]
  }
  private getRightmostIntersectionPoint = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points.filter(({ side }) => side === 'right').sort((a, b) => b.point.x - a.point.x)[0]
  }
  private getTopmostIntersectionPoint = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points
      .filter(({ side }) => side === 'top' || side === 'bottom')
      .sort((a, b) => a.point.y - b.point.y)[0]
  }
  private getLeftmostIntersectionPoint = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points.filter(({ side }) => side === 'left').sort((a, b) => a.point.x - b.point.x)[0]
  }

  private getClosestPointsToBody = ({
    intersectionPoints,
    bodyMovementDirection,
  }: {
    intersectionPoints: Array<IntersectionPoint>
    bodyMovementDirection: ExpandedDirection
  }): Array<IntersectionPoint> | null => {
    const closestPoints: Array<IntersectionPoint> = []

    if (!intersectionPoints.length) {
      return null
    }

    if (intersectionPoints.length > 1) {
      if (bodyMovementDirection.includes('down')) {
        const topmostIntersectionPoint = this.getTopmostIntersectionPoint(intersectionPoints)
        if (topmostIntersectionPoint) {
          closestPoints.push(topmostIntersectionPoint)
        }
      }
      if (bodyMovementDirection.includes('right')) {
        const leftmostIntersectionPoint = this.getLeftmostIntersectionPoint(intersectionPoints)
        if (leftmostIntersectionPoint) {
          closestPoints.push(leftmostIntersectionPoint)
        }
      }
      if (bodyMovementDirection.includes('up')) {
        const downmostIntersectionPoint = this.getDownmostIntersectionPoints(intersectionPoints)
        if (downmostIntersectionPoint) {
          closestPoints.push(downmostIntersectionPoint)
        }
      }
      if (bodyMovementDirection.includes('left')) {
        const rightmostIntersectionPoint = this.getRightmostIntersectionPoint(intersectionPoints)
        if (rightmostIntersectionPoint) {
          closestPoints.push(rightmostIntersectionPoint)
        }
      }
    } else {
      closestPoints.push(intersectionPoints[0])
    }
    return closestPoints
  }

  private getIntersectionPointsOfBodyDeltaLinesAndObstacles = ({
    prevHitbox,
    currentHitbox,
    obstacles,
  }: {
    prevHitbox: PointPair
    currentHitbox: PointPair
    obstacles: Array<HitboxWithId>
  }): Array<IntersectionPoint> | null => {
    const bodyDeltaLines = this.getDeltaLines(prevHitbox, currentHitbox, 5)

    var closestIntersectionPoints: Array<IntersectionPoint> = []
    bodyDeltaLines.forEach((bodyDeltaLine) => {
      const intersectionPointsWithObstacles: Array<IntersectionPoint> = []
      obstacles.forEach((obstacle) => {
        const intersectionPointsWithObstacle = this.getIntersectionPointsOfLineAndObstacle(
          bodyDeltaLine,
          obstacle,
        )
        if (intersectionPointsWithObstacle) {
          intersectionPointsWithObstacles.push(...intersectionPointsWithObstacle)
        }
      })

      if (intersectionPointsWithObstacles.length) {
        var closestPoint: IntersectionPoint
        if (intersectionPointsWithObstacles.length > 1) {
          closestPoint = this.getClosestIntersectionPoint(
            bodyDeltaLine,
            intersectionPointsWithObstacles,
          )
        } else {
          closestPoint = intersectionPointsWithObstacles[0]
        }

        // Угловые точки игнорируются, т.к они не относятся ни к одной из 4 сторон однозначно
        if (
          !this.isObstacleCornerPoint(
            this.getStaticObstacleById(closestPoint.obstacleId).hitbox,
            closestPoint.point,
          )
        ) {
          closestIntersectionPoints.push(closestPoint)
        }
      }
    })

    if (!closestIntersectionPoints.length) {
      return null
    }

    closestIntersectionPoints = closestIntersectionPoints.filter(({ obstacleId, side }) => {
      const obstacle: HitboxWithId = obstacles.find(({ id }) => id === obstacleId)!
      return (
        (side === 'bottom' &&
          prevHitbox.y1 >= obstacle.hitbox.y2 &&
          currentHitbox.y1 < obstacle.hitbox.y2) ||
        (side === 'right' &&
          prevHitbox.x1 >= obstacle.hitbox.x2 &&
          currentHitbox.x1 < obstacle.hitbox.x2) ||
        (side === 'top' &&
          prevHitbox.y2 <= obstacle.hitbox.y1 &&
          currentHitbox.y2 > obstacle.hitbox.y1) ||
        (side === 'left' &&
          prevHitbox.x2 <= obstacle.hitbox.x1 &&
          currentHitbox.x2 > obstacle.hitbox.x1)
      )
    })

    if (!closestIntersectionPoints.length) {
      return null
    }

    if (closestIntersectionPoints.length > 1) {
      const bodyMovementDirection = this.getMovementDirectionByHitbox(prevHitbox, currentHitbox)
      const intersectionPointsOfBodyDeltaLinesAndObstacles = this.getClosestPointsToBody({
        intersectionPoints: closestIntersectionPoints,
        bodyMovementDirection,
      })
      return intersectionPointsOfBodyDeltaLinesAndObstacles
    } else {
      return [closestIntersectionPoints[0]]
    }
  }

  private getIntersectionPointsOfBodyAndObstacles = ({
    from,
    to,
    obstacles,
  }: {
    from: PointPair
    to: PointPair
    obstacles: Array<HitboxWithId>
  }): Array<IntersectionPoint> | null => {
    const prevToCurrentBodyDeltaLinesIntersectionPoints =
      this.getIntersectionPointsOfBodyDeltaLinesAndObstacles({
        prevHitbox: from,
        currentHitbox: to,
        obstacles,
      })

    return prevToCurrentBodyDeltaLinesIntersectionPoints
  }

  private handleIntersectionPoint = (
    body: ColliderBodyWithHitbox,
    intersectionPoint: IntersectionPoint,
  ): void => {
    const obstacle = this.staticObstacles.find(({ id }) => id === intersectionPoint.obstacleId)!
    const obstacleHitbox = obstacle.hitbox
    if (intersectionPoint.side === 'bottom') {
      this.handleYIntersectionOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleBottom)
    }
    if (intersectionPoint.side === 'right') {
      this.handleXIntersectionPointOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleRight)
    }
    if (intersectionPoint.side === 'top') {
      this.handleYIntersectionOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleTop)
    }
    if (intersectionPoint.side === 'left') {
      this.handleXIntersectionPointOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleLeft)
    }
  }

  //! Обработка точек пересечения
  private setBodyToObstacleBottom = (body: ColliderBodyWithHitbox, obstacle: PointPair): void => {
    body.position.setY(obstacle.y2)
  }
  private setBodyToObstacleRight = (body: ColliderBodyWithHitbox, obstacle: PointPair): void => {
    body.position.setX(obstacle.x2)
  }
  private setBodyToObstacleTop = (body: ColliderBodyWithHitbox, obstacle: PointPair): void => {
    body.position.setY(obstacle.y1 - body.size.height)
  }
  private setBodyToObstacleLeft = (body: ColliderBodyWithHitbox, obstacle: PointPair): void => {
    body.position.setX(obstacle.x1 - body.size.width)
  }

  private handleYIntersectionOfBodyAndObstacle = (
    body: ColliderBodyWithHitbox,
    obstacle: PointPair,
    actionToChangeBodyPosition: SetBodyToObstacleFn,
  ): void => {
    const prevBodyHitbox = this.bodiesPrevHitboxes[body.id]
    const currentBodyHitbox = body.hitbox

    const deltaXHitbox = this.getDeltaXHitbox(prevBodyHitbox, currentBodyHitbox)

    const intersectionPointsOfXObstacles = this.getIntersectionPointsOfBodyAndObstacles({
      from: prevBodyHitbox,
      to: deltaXHitbox,
      obstacles: this.staticObstacles,
    })

    if (intersectionPointsOfXObstacles) {
      const intersectionPoint = intersectionPointsOfXObstacles[0]
      const intersectedObstacleHitbox = this.getStaticObstacleById(intersectionPoint.obstacleId).hitbox
      if (intersectionPoint.side === 'right') {
        this.setBodyToObstacleRight(body, intersectedObstacleHitbox)
      } else if (intersectionPoint.side === 'left') {
        this.setBodyToObstacleLeft(body, intersectedObstacleHitbox)
      }
    }

    actionToChangeBodyPosition(body, obstacle)
  }
  private handleXIntersectionPointOfBodyAndObstacle = (
    body: ColliderBodyWithHitbox,
    obstacle: PointPair,
    actionToChangeBodyPosition: SetBodyToObstacleFn,
  ): void => {
    const prevBodyHitbox = this.bodiesPrevHitboxes[body.id]
    const currentBodyHitbox = body.hitbox

    const deltaYHitbox = this.getDeltaYHitbox(prevBodyHitbox, currentBodyHitbox)

    const intersectionPointsOfYObstacles = this.getIntersectionPointsOfBodyAndObstacles({
      from: prevBodyHitbox,
      to: deltaYHitbox,
      obstacles: this.staticObstacles,
    })

    if (intersectionPointsOfYObstacles) {
      const intersectionPoint = intersectionPointsOfYObstacles[0]
      const intersectedObstacleHitbox = this.getStaticObstacleById(intersectionPoint.obstacleId).hitbox
      if (intersectionPoint.side === 'bottom') {
        this.setBodyToObstacleBottom(body, intersectedObstacleHitbox)
      } else if (intersectionPoint.side === 'top') {
        this.setBodyToObstacleTop(body, intersectedObstacleHitbox)
      }
    }

    actionToChangeBodyPosition(body, obstacle)
  }

  //! Работа коллайдера
  private handleBodyAndStaticObstaclesCollision = (
    body: ColliderBodyWithHitboxAndStuckPlaces,
  ): void => {
    const bodyPrevToCurrentIntersectionPointsWithObstacles =
      this.getIntersectionPointsOfBodyAndObstacles({
        from: this.bodiesPrevHitboxes[body.id],
        to: body.hitbox,
        obstacles: this.staticObstacles,
      })

    if (bodyPrevToCurrentIntersectionPointsWithObstacles) {
      this.addBodyStuckPlace(body, 'obstacle')
      bodyPrevToCurrentIntersectionPointsWithObstacles.forEach((intersectionPoint) => {
        this.handleIntersectionPoint(body, intersectionPoint)
      })
    } else {
      this.removeBodyStuckPlace(body, 'obstacle')
    }
  }

  private handleBodyCollision = (body: ColliderBodyWithHitboxAndStuckPlaces): void => {
    if (!this.bodiesPrevHitboxes[body.id]) {
      this.setBodyPrevHitbox(body.id, this.getBodyHitbox(body))
    }
    body.hitbox = this.getBodyHitbox(body)
    const prevBodyHitbox = this.bodiesPrevHitboxes[body.id]

    if (prevBodyHitbox) {
      this.handleBodyAndStaticObstaclesCollision(body)
    }

    this.setBodyPrevHitbox(body.id, this.getBodyHitbox(body))
  }

  //? Пока что не разрешаем выходить персонажам за ЭКРАН
  private keepBodyInMap = (body: ColliderBodyWithHitboxAndStuckPlaces): void => {
    const bodyMinX = 0
    const bodyMinY = 0
    const bodyMaxX = this.screen.width - body.size.width
    const bodyMaxY = this.screen.height - body.size.height

    const isOutOfDownMapBorder = body.position.y > bodyMaxY
    const isOutOfRightMapBorder = body.position.x > bodyMaxX
    const isOutOfTopMapBorder = body.position.y < bodyMinY
    const isOutOfLeftMapBorder = body.position.x < bodyMinX

    const isOutOfMap =
      isOutOfDownMapBorder || isOutOfRightMapBorder || isOutOfTopMapBorder || isOutOfLeftMapBorder

    if (isOutOfMap) {
      this.addBodyStuckPlace(body, 'mapBorder')

      if (isOutOfDownMapBorder) {
        body.position.setY(bodyMaxY)
      }
      if (isOutOfRightMapBorder) {
        body.position.setX(bodyMaxX)
      }
      if (isOutOfTopMapBorder) {
        body.position.setY(bodyMinY)
      }
      if (isOutOfLeftMapBorder) {
        body.position.setX(bodyMinX)
      }
    } else {
      this.removeBodyStuckPlace(body, 'mapBorder')
    }
  }

  update = (): void => {
    this.bodies.forEach((body) => {
      const bodyWithHitboxAndStuckPlaces: ColliderBodyWithHitboxAndStuckPlaces = {
        ...body,
        stuckPlaces: [],
      }
      this.handleBodyCollision(bodyWithHitboxAndStuckPlaces)
      this.keepBodyInMap(bodyWithHitboxAndStuckPlaces)

      if (isCharacter(body)) {
        if (bodyWithHitboxAndStuckPlaces.stuckPlaces.length > 0) {
          body.movement.setIsStuck(true)
        } else {
          body.movement.setIsStuck(false)
        }
      }
    })
  }
}
