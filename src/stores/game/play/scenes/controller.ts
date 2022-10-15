import { makeAutoObservable } from 'mobx'

import { resolvedPromise } from 'lib/async'

import { GameScreen } from '../screen'
import { createMainGameScene } from './list/market'

export class GameSceneController {
  private screen: GameScreen

  private fnsForCreatingUsedScenes = [createMainGameScene] as const

  list: Record<
    ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>['name'],
    ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>
  >

  constructor(config: { screen: GameScreen }) {
    this.screen = config.screen

    this.list = this.fnsForCreatingUsedScenes.reduce((acc, createScene) => {
      const scene = createScene(this.screen)
      acc[scene.name] = scene
      return acc
    }, {} as Record<ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>['name'], ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>>)

    makeAutoObservable(this)
  }

  currentScene: ReturnType<
    InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]
  >

  setScene = (
    sceneName: ReturnType<
      InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]
    >['name'],
  ): Promise<void> => {
    const createAndDrawMap = (): void => {
      this.currentScene.createMap()
      this.currentScene.drawMap()
    }

    this.currentScene = this.list[sceneName]

    if (!this.isAllCurrentSceneImagesLoaded) {
      return this.loadAllCurrentSceneImages().then(() => createAndDrawMap())
    } else {
      createAndDrawMap()
      return resolvedPromise
    }
  }

  loadAllCurrentSceneImages = (): Promise<void> => {
    return this.currentScene.imageContainer.loadAll()
  }

  get isAllCurrentSceneImagesLoaded(): boolean {
    return this.currentScene.imageContainer.isAllImagesLoaded
  }

  updateCurrentScene = (): void => {
    this.currentScene.drawMap()
  }
}
