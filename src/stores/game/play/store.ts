import { makeAutoObservable } from 'mobx'

import { KeyboardStore } from 'stores/keyboard.store'

import { GameScript, getParsedGameScript } from 'content/text/get-parsed-game-script'

import { PreGameForm } from '../pre-game-form'
import { CharacterName, CharactersController } from './characters/controller'
import { PlayerCharacterConfig } from './characters/player/character'
import { Collider } from './collider'
import { Market } from './market'
import { GameMenusController } from './menus-controller'
import { GamePauseController } from './pause-controller'
import { Player } from './player'
import { GameScenesController, SceneName } from './scenes/controller'
import { GameScreen } from './screen'
import { GameSettings } from './settings/settings'
import { SharedPlayMethods } from './shared-methods/shared-methods'
import { TextboxesController } from './textbox/controller'
import { TransitionScreen } from './transition-screen'

export type DataFromPreGameForm = Pick<PreGameForm, 'playerCharacterName' | 'marketName'>

export type GamePlayStoreConfig = {
  keyboard: KeyboardStore
  dataFromPreGameForm: DataFromPreGameForm
}
export class GamePlayStore {
  private keyboard: KeyboardStore
  dataFromPreGameForm: DataFromPreGameForm

  script: GameScript
  market: Market
  textboxesController: TextboxesController

  constructor(config: GamePlayStoreConfig) {
    this.keyboard = config.keyboard
    this.dataFromPreGameForm = config.dataFromPreGameForm

    //!Сценарий
    this.script = getParsedGameScript({
      playerCharacterName: this.dataFromPreGameForm.playerCharacterName,
      marketName: this.dataFromPreGameForm.marketName,
    })

    //!Магазин
    this.market = new Market({ name: this.dataFromPreGameForm.marketName })

    //!Контроллер текстбоксов
    this.textboxesController = new TextboxesController({
      gameScript: this.script,
      pauseController: this.pauseController,
    })

    makeAutoObservable(this)
  }

  isPlay = true
  setIsPlay = (value: boolean): void => {
    this.isPlay = value
  }

  //!Игрок
  player: Player = new Player()
  createPlayerCharacter = (): Promise<void> => {
    const playerCharacterConfig: PlayerCharacterConfig = {
      name: this.dataFromPreGameForm.playerCharacterName,
      settings: this.settings,
      screen: this.screen,
    }

    return this.player.createCharacter({
      characterController: this.charactersController,
      characterConfig: playerCharacterConfig,
    })
  }

  //!Общие методы
  sharedMethods = new SharedPlayMethods()

  //!Контроллер персонажей
  charactersController = new CharactersController()
  addActiveCharacter = (characterName: CharacterName): void => {
    this.charactersController.addActiveCharacter(characterName)
    const character = this.charactersController.list[characterName]
    this.collider.addBody(character)
  }
  removeActiveCharacter = (characterName: CharacterName): void => {
    const character = this.charactersController.list[characterName]
    this.collider.removeBody(character.id)
    this.charactersController.removeActiveCharacter(characterName)
  }

  //!Настройки
  settings = new GameSettings()

  //!Экран
  screen = new GameScreen({ width: screen.width, height: screen.height })

  //!Контроллер сцен
  sceneController = new GameScenesController({
    screen: this.screen,
    characterList: this.charactersController.list,
  })
  setScene = (sceneName: SceneName): Promise<void> => {
    return this.sceneController.setScene(sceneName).then(() => {
      this.charactersController.clearActiveCharacters()
      this.collider.clear()
      this.collider.addStaticObstacles(this.sceneController.currentScene.map.hitboxes)
    })
  }

  //!Контроллер паузы
  pauseController = new GamePauseController({
    characterController: this.charactersController,
    sharedMethods: this.sharedMethods,
  })

  //!Контроллер меню
  menusController = new GameMenusController()

  //!Коллайдер
  collider = new Collider({ screen: this.screen })

  //!Подготовка игры
  isGamePrepared = false
  setIsGamePrepared = (value: boolean): void => {
    this.isGamePrepared = value
  }
  initializeGame = (): Promise<void> => {
    return this.setScene('marketMain').then(() => {
      return this.createPlayerCharacter().then(() => {
        if (this.player.character) {
          this.sharedMethods.playerCharacter.setPlayerCharacter(this.player.character)
          this.addActiveCharacter('player')
          this.sceneController.currentScene.charactersManipulator.positionCharacter('player', {
            x: 'center',
            y: 'center',
          })
          this.setIsGamePrepared(true)
        }
      })
    })
  }

  //!Опенинг
  opening = new TransitionScreen({
    sharedPlayMethods: this.sharedMethods,
    appearanceMs: 1500,
    disappearanceMs: 1500,
    durationMs: 3500,
    background: '#000000',
  })

  //!Игровые циклы
  private handlePlayerCharacterMovementKeys = (): void => {
    this.player.character?.movement.handleMovementKeys(this.keyboard)
  }

  updateActiveCharacters = (): void => {
    this.charactersController.activeCharacters.forEach((character) => {
      character.update()
    })
  }

  update = (): void => {
    this.screen.clear()
    this.collider.update()
    this.sceneController.updateCurrentScene()
    this.updateActiveCharacters()
  }

  private gameLoop = (): void => {
    this.handlePlayerCharacterMovementKeys()
    this.update()
  }

  mainLoop = (): void => {
    this.gameLoop()
    const id = window.requestAnimationFrame(this.mainLoop)
    if (!this.isPlay) {
      window.cancelAnimationFrame(id)
    }
  }

  //!Запуск игры
  run = (): void => {
    this.initializeGame().then(() => {
      this.mainLoop()
      this.opening.run().then(() => {
        this.textboxesController.setCurrentTextbox({ name: 'welcome' })
      })
    })
  }
}
