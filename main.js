const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs').promises

try {
  require('electron-reloader')(module, {
    debug: true,
    watchRenderer: true
  });
} catch (_) { }

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

// 修改文件打开处理程序
ipcMain.handle('dialog:openFile', async () => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'JavaScript', extensions: ['js', 'jsx'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });

        if (!canceled && filePaths.length > 0) {
            const content = await fs.readFile(filePaths[0], 'utf8');
            return {
                path: filePaths[0],
                content: content
            };
        }
        return null;
    } catch (error) {
        console.error('Error opening file:', error);
        throw error;
    }
});

ipcMain.handle('dialog:saveFile', async (event, filePath, content) => {
    await fs.writeFile(filePath, content, 'utf8');
    return true;
});

ipcMain.handle('dialog:saveFileAs', async (event, content) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [
            { name: 'JavaScript', extensions: ['js', 'jsx'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });
    if (!canceled) {
        await fs.writeFile(filePath, content, 'utf8');
        return filePath;
    }
});

ipcMain.handle('file:read', async (event, filePath) => {
    return await fs.readFile(filePath, 'utf8');
});

ipcMain.handle('file:list', async () => {
    const currentDir = process.cwd();
    const files = await fs.readdir(currentDir, { withFileTypes: true });
    return files.map(file => ({
        name: file.name,
        type: file.isDirectory() ? 'directory' : 'file',
        path: path.join(currentDir, file.name)
    }));
}); 