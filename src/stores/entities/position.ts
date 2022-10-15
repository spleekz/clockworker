export class Position {
  x = 0
  y = 0
  setX = (x: number): void => {
    this.x = x
  }
  setY = (y: number): void => {
    this.y = y
  }
  setXY = (x: number, y: number): void => {
    this.setX(x)
    this.setY(y)
  }
}
