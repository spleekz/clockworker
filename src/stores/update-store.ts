import { makeAutoObservable } from 'mobx'

import isElectron from 'is-electron'

type UpdateInfo = {
  version: string
  releaseNotes: string
}

export class UpdateStore {
  constructor() {
    if (isElectron()) {
      window.ipcRenderer.on('updateAvailable', (_, updateInfo: UpdateInfo) => {
        this.setUpdateInfo(updateInfo)
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
}
