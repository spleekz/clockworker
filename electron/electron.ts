import { BrowserWindow, app } from 'electron'
import * as path from 'path'

let mainWindow: Electron.BrowserWindow | null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.setFullScreen(true)
  mainWindow.removeMenu()

  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
