import { computed, makeObservable, observable } from 'mobx'

import { Properties } from 'basic-utility-types'

import { resolvedPromise } from 'lib/async'

import { CharacterList } from '../characters/controller'
import { GameScreen } from '../screen'
import { MarketMainScene } from './list/market'

type This = InstanceType<typeof GameScenesController>

type Scene = InstanceType<Properties<This['refList']>>
export type SceneName = keyof This['refList']
type List = Record<SceneName, Scene>

type GameScenesControllerConfig = {
  screen: GameScreen
  characterList: CharacterList
}

export class GameScenesController {
  private screen: GameScreen
  private characterList: CharacterList

  constructor(config: GameScenesControllerConfig) {
    this.screen = config.screen
    this.characterList = config.characterList

    makeObservable(this, {
      list: observable,
      currentScene: observable,
      isAllCurrentSceneImagesLoaded: computed,
    })
  }

  //Список сцен, использующихся в контроллере
  private refList = { marketMain: MarketMainScene }

  //Список созданных сцен
  list: List = {} as List

  currentScene: Scene = {} as Scene

  createScene = (sceneName: SceneName): void => {
    this.list[sceneName] = new this.refList[sceneName]({
      screen: this.screen,
      characterList: this.characterList,
    })
  }

  setScene = (sceneName: SceneName): Promise<void> => {
    if (!this.list[sceneName]) {
      this.createScene(sceneName)
    }

    this.currentScene = this.list[sceneName]

    const createAndDrawMap = (): void => {
      this.currentScene.createMap()
      this.currentScene.drawMap()
    }

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
