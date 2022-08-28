export class GamePauseController {
  isGamePaused = false
  pauseGame(): void {
    this.isGamePaused = true
  }
  resumeGame(): void {
    this.isGamePaused = false
  }
  toggleGamePause(): void {
    this.isGamePaused = !this.isGamePaused
  }
}
