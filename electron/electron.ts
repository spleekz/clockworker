import { BrowserWindow, Electron, app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as fs from 'fs'
import { DownloadProgressInfo, UpdateInfo } from 'main-renderer-shared/types'
import * as path from 'path'

var mainWindow: Electron.BrowserWindow | null

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'assets/clockworker-icon.ico'),
  })

  mainWindow.setFullScreen(true)
  mainWindow.removeMenu()

  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  autoUpdater.checkForUpdates()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

autoUpdater.disableWebInstaller = true
autoUpdater.autoDownload = false
autoUpdater.on('update-available', ({ version, releaseNotes }) => {
  if (mainWindow) {
    mainWindow.webContents.send<UpdateInfo>('updateAvailable', {
      version,
      releaseNotes: releaseNotes as string,
    })
  }
})

ipcMain.on('updateGame', () => {
  autoUpdater.downloadUpdate()
})

autoUpdater.on('download-progress', ({ percent }) => {
  if (mainWindow) {
    mainWindow.webContents.send<DownloadProgressInfo>('downloadProgress', { percentage: percent })
  }
})

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

const userData = app.getPath('userData')

ipcMain.on('checkIfAppSettingsFileExists', (event) => {
  const fileExists = fs.existsSync(`${userData}/app-settings.json`)
  event.returnValue = fileExists
})

ipcMain.handle('setAppSettingsToFileAsync', async (_, settings: Record<any, string>) => {
  return fs.promises.writeFile(`${userData}/app-settings.json`, JSON.stringify(settings), {
    encoding: 'utf-8',
  })
})

ipcMain.on('setAppSettingsToFileSync', (_, settings: Record<any, string>) => {
  fs.writeFileSync(`${userData}/app-settings.json`, JSON.stringify(settings), {
    encoding: 'utf-8',
  })
})

ipcMain.on('getAppSettings', (event) => {
  const content = fs.readFileSync(`${userData}/app-settings.json`, { encoding: 'utf-8' })
  event.returnValue = JSON.parse(content)
})
