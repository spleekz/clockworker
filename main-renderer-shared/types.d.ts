export type IPCEventName =
  | 'updateAvailable'
  | 'downloadProgress'
  | 'updateGame'
  | 'checkIfAppSettingsFileExists'
  | 'setAppSettingsToFileAsync'
  | 'setAppSettingsToFileSync'
  | 'getAppSettings'

export type UpdateInfo = {
  version: string
  releaseNotes: string
}

export type DownloadProgressInfo = {
  percentage: number
}
