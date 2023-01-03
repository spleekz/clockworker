import { IpcRenderer } from 'electron'

declare global {
  /* eslint-disable prefer-type-alias/prefer-type-alias */
  interface Window {
    ipcRenderer: IpcRenderer
  }
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: Array<T>) => unknown, thisArg?: any): T
  }
}
