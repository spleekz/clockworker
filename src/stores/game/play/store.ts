import { makeAutoObservable } from 'mobx'

import { KeyboardStore } from 'stores/keyboard.store'

import { GameScript, getParsedGameScript } from 'content/text/get-parsed-game-script'

import { CharacterName, CharactersController } from './characters/controller'
import { Player } from './characters/player/player'
import { Collider } from './collider'
import { GameActions } from './game-actions'
import { Market } from './market'
import { GameMenuController } from './menu-controller'
import { GamePauseController } from './pause-controller'
import { GameSceneController } from './scenes/controller'
import { GameScreen } from './screen'
import { GameSettings } from './settings/settings'
import { TextboxController } from './textbox/controller'

export type DataFromGameSetupForm = {
  playerNickname: string
  marketName: string
}

export type GamePlayStoreConfig = {
  keyboard: KeyboardStore
  dataFromGameSetupForm: DataFromGameSetupForm
}

export class GamePlayStore {
  private keyboard: KeyboardStore
  dataFromGameSetupForm: DataFromGameSetupForm

  script: GameScript
  player: Player
  market: Market
  actions: GameActions
  textboxController: TextboxController

  constructor(config: GamePlayStoreConfig) {
    this.keyboard = config.keyboard
    this.dataFromGameSetupForm = config.dataFromGameSetupForm

    //!Сценарий
    this.script = getParsedGameScript({
      playerNickname: this.dataFromGameSetupForm.playerNickname,
      marketName: this.dataFromGameSetupForm.marketName,
    })

    //!Магазин
    this.market = new Market({ name: this.dataFromGameSetupForm.marketName })

    //!Контроллер текстбоксов
    this.textboxController = new TextboxController({ gameScript: this.script })

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Создание игрока
  createPlayer(): void {
    //Временное решение
    const getMapSizeParameterValue = (parameterName: 'width' | 'height', value: number): number => {
      const screenParameterValue = this.screen[parameterName]
      return value > screenParameterValue ? screenParameterValue : value
    }

    const playerCharacterConfig = {
      nickname: this.dataFromGameSetupForm.playerNickname,
      settings: this.settings.current,
      screen: this.screen,

      mapSize: {
        width: getMapSizeParameterValue('width', this.sceneController.currentScene.mapSize.width),
        height: getMapSizeParameterValue('height', this.sceneController.currentScene.mapSize.height),
      },
    }

    this.charactersController.createCharacter('player', playerCharacterConfig)

    this.player = this.charactersController.list['player']
  }

  //!Контроллер персонажей
  charactersController = new CharactersController()
  addActiveCharacter(characterName: CharacterName): void {
    this.charactersController.addActiveCharacter(characterName)
    const character = this.charactersController.list[characterName]
    this.collider.addBody(character)
  }
  removeActiveCharacter(characterName: CharacterName): void {
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
  setScene(
    sceneName: ReturnType<
      InstanceType<typeof GameSceneController>['fnsForCreatingUsedScenes'][number]
    >['name'],
  ): Promise<void> {
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

  //!Загрузка игры
  setupGame(): void {
    this.setScene('market').then(() => {
      this.createPlayer()
      //!Игровые события
      this.actions = new GameActions({ player: this.player })
      this.addActiveCharacter('player')

      this.player.movement.hideInTopMapBorder()
    })
  }

  get isGameLoaded(): boolean {
    //Проверка, что все изображения загрузились
    return (
      this.charactersController.isAllActiveCharactersImagesLoaded &&
      Boolean(this.sceneController.currentScene) &&
      this.sceneController.isAllCurrentSceneImagesLoaded
    )
  }

  //!Игровые циклы
  updateActiveCharacters(): void {
    this.charactersController.activeCharactersNames.forEach((activeCharacterName) => {
      const activeCharacter = this.charactersController.list[activeCharacterName]
      activeCharacter.update()
    })
  }

  update(): void {
    this.screen.clear()
    this.collider.update()
    this.sceneController.updateCurrentScene()
    this.player.update()
  }

  private gameInPlayLoop(): void {
    //Пользователь не может управлять героем во время паузы, открытого текстбокса,
    //автомува, и когда персонаж находится за пределами карты
    if (
      !this.textboxController.isTextboxOpened &&
      !this.player.movement.isAutomoving &&
      this.player.movement.isAllowedPosition(this.player.position)
    ) {
      this.player.movement.handleMovementKeys(this.keyboard)
    }
  }

  private gameLoop(): void {
    if (!this.pauseController.isGamePaused) {
      this.gameInPlayLoop()
    }

    if (this.player.movement.isAutomoving) {
      //Во время паузы останавливать автомув и возобновлять его после отжатия паузы
      if (this.pauseController.isGamePaused) {
        this.player.movement.pauseAutomove()
      } else {
        this.player.movement.resumeAutomove()
      }
    }

    this.update()
  }

  mainLoop(): void {
    this.gameLoop()
    window.requestAnimationFrame(this.mainLoop)
  }

  //!Запуск игры
  run(): void {
    this.mainLoop()
    this.textboxController.setCurrentTextbox({
      name: 'welcome',
      onClose: () =>
        this.actions.playerEntering().then(() => this.player.movement.setCurrentMovementType('walk')),
    })
  }
}
