import { DownloadProgressInfo, UpdateInfo } from 'desktop-web-shared-types/index'
import { BrowserWindow, app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'

var mainWindow: Electron.BrowserWindow | null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, './assets/clockworker-icon.ico'),
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
