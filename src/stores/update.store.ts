import { makeAutoObservable } from 'mobx'

import { DownloadProgressInfo, UpdateInfo } from 'desktop-web-shared-types/index'
import isElectron from 'is-electron'

export class UpdateStore {
  constructor() {
    if (isElectron()) {
      window.ipcRenderer.on<UpdateInfo>('updateAvailable', (_, updateInfo) => {
        this.setUpdateInfo(updateInfo)
      })
      window.ipcRenderer.on<DownloadProgressInfo>('downloadProgress', (_, downloadProgressInfo) => {
        this.setCurrentPercentage(downloadProgressInfo.percentage)
      })
    }

    makeAutoObservable(this)
  }

  version: string | null = null
  releaseNotes: string | null = null

  setUpdateInfo = (updateInfo: UpdateInfo): void => {
    this.version = updateInfo.version
    this.releaseNotes = updateInfo.releaseNotes
  }

  isNotificationOpened = false
  setIsNotificationOpened = (value: boolean): void => {
    this.isNotificationOpened = value
  }

  updateGame = (): void => {
    window.ipcRenderer.send('updateGame')
  }

  currentPercentage: number | null = null
  setCurrentPercentage = (percentage: number): void => {
    this.currentPercentage = percentage
  }
}
