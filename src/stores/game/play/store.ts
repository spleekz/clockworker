import { makeAutoObservable } from 'mobx'

import { KeyboardStore } from 'stores/keyboard.store'

import { GameScript, getParsedGameScript } from 'content/text/get-parsed-game-script'

import { GameActions } from './game-actions'
import { Market } from './market'
import { GameMenuController } from './menu-controller'
import { GamePauseController } from './pause-controller'
import { Player } from './player/player'
import { GameSceneController } from './scenes/controller'
import { GameScreen } from './screen'
import { GameSettings } from './settings/settings'
import { TextboxController } from './textbox/controller'

export type DataFromGameSetupForm = {
  playerName: string
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
      playerName: this.dataFromGameSetupForm.playerName,
      marketName: this.dataFromGameSetupForm.marketName,
    })

    //!Игрок
    this.player = new Player({
      name: this.dataFromGameSetupForm.playerName,
      settings: this.settings.current,
      screen: this.screen,
      mapSize: {
        width: this.sceneController.currentScene.map.width,
        height: this.sceneController.currentScene.map.height,
      },
    })

    //!Магазин
    this.market = new Market({ name: this.dataFromGameSetupForm.marketName })

    //!Игровые события
    this.actions = new GameActions({ player: this.player })

    //!Контроллер текстбоксов
    this.textboxController = new TextboxController({ gameScript: this.script })

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Настройки
  settings = new GameSettings()

  //!Экран
  screen = new GameScreen({ width: screen.width, height: screen.height })

  //!Контроллер сцен
  sceneController = new GameSceneController({ screen: this.screen, initialScene: 'market' })

  //!Контроллер паузы
  pauseController = new GamePauseController()

  //!Контроллер меню
  menuController = new GameMenuController()

  //!Сетап игры
  get isGameLoaded(): boolean {
    //Проверка, что все изображения загрузились
    return (
      this.player.imageContainer.isAllImagesLoaded &&
      this.sceneController.isAllCurrentSceneImagesLoaded
    )
  }
  setupGame(): void {
    this.player.movement.hideInTopMapBorder(0)
  }

  //!Игровые циклы
  update(): void {
    this.screen.clear()
    this.player.update()
  }

  private gameInPlayLoop(): void {
    //Пользователь не может управлять героем во время паузы, открытого текстбокса,
    //автомува, и когда персонаж находится за пределами карты
    if (
      !this.textboxController.isTextboxOpened &&
      !this.player.movement.isAutoMoving &&
      this.player.movement.isAllowedPosition(this.player.movement.position)
    ) {
      this.player.movement.handleMovementKeys(this.keyboard)
    }
  }

  private gameLoop(): void {
    if (!this.pauseController.isGamePaused) {
      this.gameInPlayLoop()
    }

    if (this.player.movement.isAutoMoving) {
      //Во время паузы останавливать автомув и возобновлять его после отжатия паузы
      if (this.pauseController.isGamePaused) {
        this.player.movement.pauseAutoMove()
      } else {
        this.player.movement.resumeAutoMove()
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
