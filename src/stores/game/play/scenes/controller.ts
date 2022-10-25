import { makeAutoObservable } from 'mobx'

import { resolvedPromise } from 'lib/async'

import { CharacterList } from '../characters/controller'
import { GameScreen } from '../screen'
import { createMainGameScene } from './list/market'

type GameSceneControllerConfig = {
  screen: GameScreen
  characterList: CharacterList
}
export class GameSceneController {
  private screen: GameScreen
  private characterList: CharacterList

  private fnsForCreatingUsedScenes = [createMainGameScene] as const

  list: Record<
    ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>['name'],
    ReturnType<InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]>
  >

  constructor(config: GameSceneControllerConfig) {
    this.screen = config.screen

    this.list = this.fnsForCreatingUsedScenes.reduce((acc, createScene) => {
      const scene = createScene({ screen: this.screen, characterList: config.characterList })
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
