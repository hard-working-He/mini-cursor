const { contextBridge, ipcRenderer } = require('electron')
const { chatCompletion } = require('./src/api/zhipuai.js')

contextBridge.exposeInMainWorld('api', {
  // 文件操作 API
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (path, content) => ipcRenderer.invoke('dialog:saveFile', path, content),
  saveFileAs: (content) => ipcRenderer.invoke('dialog:saveFileAs', content),
  readFile: (path) => ipcRenderer.invoke('file:read', path),
  listFiles: () => ipcRenderer.invoke('file:list'),
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  
  // 原有的后端通信方法
  sendToBackend: async (data) => {
    // 实现与后端的通信逻辑
  },

  // 获取文件语言类型
  getFileLanguage: (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'go': 'go',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'rs': 'rust',
      // 添加更多语言支持
    };
    return languageMap[ext] || 'plaintext';
  },

  chat: async (message) => {
    try {
      return await chatCompletion(message);
    } catch (error) {
      console.error('Chat API Error:', error);
      throw error;
    }
  },
}) 