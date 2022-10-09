import { makeAutoObservable } from 'mobx'

import isElectron from 'is-electron'

export type UpdateInfo = {
  version: string
  releaseNotes: string
}

type DownloadProgressInfo = {
  percentage: number
}

export class UpdateStore {
  constructor() {
    if (isElectron()) {
      window.ipcRenderer.on('updateAvailable', (_, updateInfo: UpdateInfo) => {
        this.setUpdateInfo(updateInfo)
      })
      window.ipcRenderer.on('downloadProgress', (_, downloadProgressInfo: DownloadProgressInfo) => {
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

  get isUpdateAvailable(): boolean {
    return this.version !== null && this.releaseNotes !== null
  }

  updateGame = (): void => {
    window.ipcRenderer.send('updateGame')
  }

  currentPercentage: number | null = null
  setCurrentPercentage = (percentage: number): void => {
    this.currentPercentage = percentage
  }
}
