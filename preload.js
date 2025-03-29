const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // 文件操作 API
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (path, content) => ipcRenderer.invoke('dialog:saveFile', path, content),
  saveFileAs: (content) => ipcRenderer.invoke('dialog:saveFileAs', content),
  readFile: (path) => ipcRenderer.invoke('file:read', path),
  listFiles: () => ipcRenderer.invoke('file:list'),
  
  // 原有的后端通信方法
  sendToBackend: async (data) => {
    // 实现与后端的通信逻辑
  }
}) 