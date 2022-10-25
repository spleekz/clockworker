import { makeAutoObservable } from 'mobx'

import { KeyboardStore } from 'stores/keyboard.store'

import { GameScript, getParsedGameScript } from 'content/text/get-parsed-game-script'

import { PreGameForm } from '../pre-game-form'
import { CharacterName, CharactersController } from './characters/controller'
import { PlayerCharacterConfig } from './characters/player/player-character'
import { Collider } from './collider'
import { GameActions } from './game-actions'
import { Market } from './market'
import { GameMenuController } from './menu-controller'
import { GamePauseController } from './pause-controller'
import { Player } from './player'
import { GameSceneController } from './scenes/controller'
import { GameScreen } from './screen'
import { GameSettings } from './settings/settings'
import { SharedPlayMethods } from './shared-methods/shared-methods'
import { TextboxController } from './textbox/controller'
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
  actions: GameActions
  textboxController: TextboxController

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
    this.textboxController = new TextboxController({
      gameScript: this.script,
      sharedPlayMethods: this.sharedMethods,
    })

    makeAutoObservable(this)
  }

  //!Игрок
  player: Player = new Player()
  createPlayerCharacter = (): void => {
    //Временное решение
    const getMapSizeParameterValue = (parameterName: 'width' | 'height', value: number): number => {
      const screenParameterValue = this.screen[parameterName]
      return value > screenParameterValue ? screenParameterValue : value
    }

    const playerCharacterConfig: PlayerCharacterConfig = {
      name: this.dataFromPreGameForm.playerCharacterName,
      settings: this.settings.current,
      screen: this.screen,
      mapSize: {
        width: getMapSizeParameterValue('width', this.sceneController.currentScene.mapSize.width),
        height: getMapSizeParameterValue('height', this.sceneController.currentScene.mapSize.height),
      },
    }

    this.player.createCharacter({
      charactersController: this.charactersController,
      characterConfig: playerCharacterConfig,
    })
  }

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
  sceneController = new GameSceneController({ screen: this.screen })
  setScene = (
    sceneName: ReturnType<
      InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]
    >['name'],
  ): Promise<void> => {
    return this.sceneController.setScene(sceneName).then(() => {
      this.charactersController.clearActiveCharacters()
      this.collider.clear()
      this.collider.addStaticObstacles(this.sceneController.currentScene.map.hitboxes)
    })
  }

  //!Контроллер паузы
  pauseController = new GamePauseController()

  //!Контроллер меню
  menuController = new GameMenuController()

  //!Коллайдер
  collider = new Collider()

  //!Общие методы
  sharedMethods = new SharedPlayMethods()
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
  updateActiveCharacters = (): void => {
    this.charactersController.activeCharactersNames.forEach((activeCharacterName) => {
      const activeCharacter = this.charactersController.list[activeCharacterName]
      activeCharacter.update()
    })
  }

  update = (): void => {
    this.screen.clear()
    this.collider.update()
    this.sceneController.updateCurrentScene()
    if (this.player.character) {
      this.player.character.update()
    }
  }

  private gameInPlayLoop = (): void => {
    //Пользователь не может управлять героем во время паузы, открытого текстбокса,
    //автомува, и когда персонаж находится за пределами карты
    if (this.player.character) {
      if (
        !this.textboxController.isTextboxOpened &&
        !this.player.character.movement.isAutomoving &&
        this.player.character.movement.isAllowedPosition(this.player.character.position)
      ) {
        this.player.character.movement.handleMovementKeys(this.keyboard)
      }
    }
  }

  private gameLoop = (): void => {
    if (!this.pauseController.isGamePaused) {
      this.gameInPlayLoop()
    }

    if (this.player.character) {
      if (this.player.character.movement.isAutomoving) {
        //Во время паузы останавливать автомув и возобновлять его после отжатия паузы
        if (this.pauseController.isGamePaused) {
          this.player.character.movement.pauseAutomove()
        } else {
          this.player.character.movement.resumeAutomove()
        }
      }
    }

    this.update()
  }

  mainLoop = (): void => {
    this.gameLoop()
    window.requestAnimationFrame(this.mainLoop)
  }

  //!Запуск игры
  run = (): void => {
    this.mainLoop()
    this.textboxController.setCurrentTextbox({
      name: 'welcome',
      onClose: () =>
        this.actions.playerCharacterEntering().then(() => {
          if (this.player.character) {
            this.player.character.movement.setCurrentMovementType('walk')
          }
        }),
    })
  }
}
