import { makeAutoObservable } from 'mobx'

import { Canvas, CanvasObject } from 'game-utility-types'

import { AppStore } from 'stores/app.store'
import { KeyboardStore } from 'stores/keyboard.store'
import { SettingsStore } from 'stores/settings.store'

import mainMap from 'content/maps/main-map.png'
import { Script, getParsedScript } from 'content/text/get-parsed-script'

import { MapStore, MapStoreConfig } from './map.store'
import { MarketStore } from './market.store'
import { PlayerStore } from './player.store'

export type CustomUserData = {
  playerName: string
  marketName: string
}

type GameStoreConfig = {
  appStore: AppStore
  settings: SettingsStore
  keyboard: KeyboardStore
  customUserData: CustomUserData
}

const mapNames = {
  main: mainMap,
}
type MapNames = typeof mapNames
type MapName = keyof MapNames

export class GameStore {
  private appStore: AppStore
  private settings: SettingsStore
  private keyboard: KeyboardStore
  customUserData: CustomUserData

  constructor(config: GameStoreConfig) {
    Object.assign(this, config)

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //!Сценарий
  get script(): Script | null {
    if (this.player && this.market) {
      return getParsedScript({
        playerName: this.player.name,
        marketName: this.market.name,
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
  initializeCanvas(canvas: Canvas): void {
    this.canvasObject.canvas = canvas
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
        name: this.customUserData.playerName,
        settings: this.settings,
        map: this.map,
        canvasObject: {
          canvas: this.canvasObject.canvas,
          ctx: this.canvasObject.ctx,
        },
        keyboard: this.keyboard,
      })
      this.appStore.clearCustomUserDataForGameStore()
    }
  }

  //!Магазин
  market: MarketStore | null = null
  createMarket(): void {
    this.market = new MarketStore({
      name: this.customUserData.marketName,
    })
  }

  //!Сетап игры
  setupGame(): void {
    this.createMap({
      width: this.canvasWidth,
      height: this.canvasHeight,
      background: this.currentMapSrc,
    })
    this.createPlayer()
    this.createMarket()
    if (this.player) {
      this.player.hideInTopMapBorder(0)
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

  //!Текст бокс
  isTextboxOpened = false
  openTextbox(): void {
    this.isTextboxOpened = true
  }
  closeTextbox(): void {
    this.isTextboxOpened = false
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
          !this.player.isAutoMoving &&
          this.player.isAllowedPosition(this.player.position)
        ) {
          this.player.handleMovementKeys()
        }

        //Во время паузы останавливать автомув
        if (this.player.isAutoMoving) {
          if (this.isGamePaused) {
            this.player.pauseAutoMove()
          } else {
            this.player.resumeAutoMove()
          }
        }

        this.player.drawSprite()
      }

      window.requestAnimationFrame(this.gameLoop)
    }
  }

  heroEntering(): void {
    setTimeout(() => {
      if (this.player) {
        this.player.autoMove(
          this.player.position,
          { x: 0, y: 0 },
          { stepSize: 0.45, framesPerStep: 11 },
        )
      }
    }, 300)
  }
}
