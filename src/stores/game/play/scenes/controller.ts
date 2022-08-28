import { GameScreen } from '../screen'
import { createMainGameScene } from './list/market'

export class GameSceneController {
  private screen: GameScreen

  private fnsForCreatingUsedScenes = [createMainGameScene] as const

  list: Record<
    ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>['name'],
    ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>
  >

  constructor(config: {
    screen: GameScreen
    initialScene: ReturnType<
      InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]
    >['name']
  }) {
    this.screen = config.screen

    this.list = this.fnsForCreatingUsedScenes.reduce((acc, createScene) => {
      const scene = createScene(this.screen)
      acc[scene.name] = scene
      return acc
    }, {} as Record<ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>['name'], ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>>)

    this.setScene(config.initialScene)
  }

  currentScene: ReturnType<
    InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]
  >

  setScene(
    sceneName: ReturnType<
      InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]
    >['name'],
  ): void {
    this.currentScene = this.list[sceneName]
    if (!this.isAllCurrentSceneImagesLoaded) {
      this.loadAllCurrentSceneImages().then(() => this.currentScene.setMap())
    } else {
      this.currentScene.setMap()
    }
  }

  loadAllCurrentSceneImages(): Promise<void> {
    return this.currentScene.imageContainer.loadAll()
  }
  get isAllCurrentSceneImagesLoaded(): boolean {
    return this.currentScene.imageContainer.isAllImagesLoaded
  }
}
