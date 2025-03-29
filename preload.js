const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // 这里可以添加与 Go 后端通信的方法
  sendToBackend: async (data) => {
    // 实现与后端的通信逻辑
  }
}) 