import { makeAutoObservable } from 'mobx'

import { UnionProperties } from 'basic-utility-types'

import { resolvedPromise } from 'lib/async'

import { CharacterList } from '../characters/controller'
import { GameScreen } from '../screen'
import { createMarketMainScene } from './list/market'

type This = InstanceType<typeof GameSceneController>

type List = Record<keyof This['refList'], ReturnType<UnionProperties<This['refList']>>>
export type SceneName = keyof This['refList']
type CurrentScene = ReturnType<UnionProperties<This['refList']>>

type GameSceneControllerConfig = {
  screen: GameScreen
  characterList: CharacterList
}

export class GameSceneController {
  private screen: GameScreen
  private characterList: CharacterList

  //Список сцен, использующихся в контроллере
  private refList = { marketMain: createMarketMainScene }

  //Список созданных сцен
  list: List = {} as List

  constructor(config: GameSceneControllerConfig) {
    this.screen = config.screen
    this.characterList = config.characterList

    makeAutoObservable(this)
  }

  currentScene: CurrentScene

  createScene = (sceneName: SceneName): void => {
    this.list[sceneName] = this.refList[sceneName]({
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
