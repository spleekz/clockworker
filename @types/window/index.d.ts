import { IpcRenderer } from 'electron'

declare global {
  /* eslint-disable prefer-type-alias/prefer-type-alias */
  interface Window {
    ipcRenderer: IpcRenderer
  }
}
