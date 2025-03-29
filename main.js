const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 启动 Go 后端服务
  const backend = spawn('./backend')
  
  backend.stdout.on('data', (data) => {
    console.log(`Backend output: ${data}`)
  })

  win.loadFile('src/index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 