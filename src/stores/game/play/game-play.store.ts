import { makeAutoObservable } from 'mobx'

import { CanvasObject } from 'game-utility-types'

import { KeyboardStore } from 'stores/keyboard.store'
import { SettingsStore } from 'stores/settings.store'

import mainMap from 'content/maps/main-map.png'
import { Script, getParsedScript } from 'content/text/get-parsed-script'

import { MapStore, MapStoreConfig } from './map.store'
import { MarketStore } from './market.store'
import { PlayerStore } from './player/player.store'
import { Textbox } from './textbox'

export type DataFromGameSetupForm = {
  playerName: string
  marketName: string
}

export type GamePlayStoreConfig = {
  settings: SettingsStore
  keyboard: KeyboardStore
  dataFromGameSetupForm: DataFromGameSetupForm
}
const mapNames = {
  main: mainMap,
}
type MapNames = typeof mapNames
type MapName = keyof MapNames

export class GamePlayStore {
  private settings: SettingsStore
  private keyboard: KeyboardStore
  dataFromGameSetupForm: DataFromGameSetupForm

  constructor(config: GamePlayStoreConfig) {
    Object.assign(this, config)

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Сценарий
  get script(): Script | null {
    if (this.dataFromGameSetupForm) {
      return getParsedScript({
        playerName: this.dataFromGameSetupForm.playerName,
        marketName: this.dataFromGameSetupForm.marketName,
      })
    }
    return null
  }

  //!Канвас
  canvasObject: CanvasObject = {
    canvas: null,
    ctx: null,
  }
  get canvasWidth(): number {
    return screen.width
  }
  get canvasHeight(): number {
    return screen.height
  }
  initializeCanvas(): void {
    this.canvasObject.canvas = document.createElement('canvas')
    this.canvasObject.canvas.width = this.canvasWidth
    this.canvasObject.canvas.height = this.canvasHeight

    const ctx = this.canvasObject.canvas.getContext('2d')
    this.canvasObject.ctx = ctx
  }

  //!Карта
  map: MapStore | null = null
  createMap(config: Omit<MapStoreConfig, 'canvas'>): void {
    if (this.canvasObject.canvas) {
      this.map = new MapStore({
        canvas: this.canvasObject.canvas,
        ...config,
      })
    }
  }
  currentMapName: MapName = 'main'
  setCurrentMapName(mapName: MapName): void {
    this.currentMapName = mapName
  }
  get currentMapSrc(): string {
    return mapNames[this.currentMapName]
  }

  //!Игрок
  player: PlayerStore | null = null
  createPlayer(): void {
    if (this.canvasObject.canvas && this.canvasObject.ctx && this.map) {
      this.canvasObject.canvas
      this.player = new PlayerStore({
        name: this.dataFromGameSetupForm.playerName,
        settings: this.settings,
        map: this.map,
        canvasObject: {
          canvas: this.canvasObject.canvas,
          ctx: this.canvasObject.ctx,
        },
        keyboard: this.keyboard,
      })
    }
  }

  //!Магазин
  market: MarketStore | null = null
  createMarket(): void {
    this.market = new MarketStore({
      name: this.dataFromGameSetupForm.marketName,
    })
  }

  //!Сетап игры
  get isGameLoaded(): boolean {
    //Проверка, что все изображения загрузились
    if (this.player && this.map) {
      return this.player.images.allAreLoaded && this.map.images.allAreLoaded
    }
    return false
  }

  setupGame(): void {
    this.initializeCanvas()
    this.createMap({
      width: this.canvasWidth,
      height: this.canvasHeight,
      background: this.currentMapSrc,
    })
    this.createPlayer()
    this.createMarket()
    if (this.player) {
      this.player.movement.hideInTopMapBorder(0)
    }
  }

  //!Контроль паузы
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

  //!Меню паузы
  isGamePauseMenuOpened = false
  openGamePauseMenu(): void {
    this.isGamePauseMenuOpened = true
  }
  closeGamePauseMenu(): void {
    this.isGamePauseMenuOpened = false
  }
  toggleGamePauseMenu(): void {
    this.isGamePauseMenuOpened = !this.isGamePauseMenuOpened
  }

  //!Настройки
  isSettingsMenuOpened = false
  openSettingsMenu(): void {
    this.isSettingsMenuOpened = true
  }
  closeSettingsMenu(): void {
    this.isSettingsMenuOpened = false
  }

  //!Текст боксы
  currentTextbox: Textbox | null = null
  setCurrentTextbox(textbox: Textbox | null): void {
    if (!textbox) {
      this.currentTextbox?.afterClose()
    }
    this.currentTextbox = textbox
  }
  get isTextboxOpened(): boolean {
    return Boolean(this.currentTextbox)
  }

  get welcomeTextbox(): Textbox {
    return new Textbox({
      text: this.script?.content.welcome ?? '',
      afterClose: this.heroEntering,
    })
  }

  //!Гейм луп
  gameLoop(): void {
    if (this.canvasObject.canvas && this.canvasObject.ctx) {
      this.canvasObject.ctx.clearRect(
        0,
        0,
        this.canvasObject.canvas.width,
        this.canvasObject.canvas.height,
      )

      if (this.player) {
        //Пользователь не может управлять героем во время паузы, открытого текстбокса,
        //автомува, и когда персонаж находится за пределами карты
        if (
          !this.isGamePaused &&
          !this.isTextboxOpened &&
          !this.player.movement.isAutoMoving &&
          this.player.movement.isAllowedPosition(this.player.movement.position)
        ) {
          this.player.movement.handleMovementKeys()
        }

        //Во время паузы останавливать автомув
        if (this.player.movement.isAutoMoving) {
          if (this.isGamePaused) {
            this.player.movement.pauseAutoMove()
          } else {
            this.player.movement.resumeAutoMove()
          }
        }

        this.player.drawSprite()
      }

      window.requestAnimationFrame(this.gameLoop)
    }
  }

  startGame(): void {
    this.gameLoop()
    this.setCurrentTextbox(this.welcomeTextbox)
  }

  heroEntering(): void {
    setTimeout(() => {
      if (this.player) {
        this.player.movement.autoMove({
          start: this.player.movement.position,
          end: { x: 0, y: 0 },
          state: this.player.movement.movementStates.entering,
        })
      }
    }, 300)
  }
}
