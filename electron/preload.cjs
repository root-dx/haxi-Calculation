const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: () => ipcRenderer.invoke('is-electron'),
  hashFile: (filePath, algorithm) => ipcRenderer.invoke('hash-file', { filePath, algorithm }),
  setWindowMode: (mode) => ipcRenderer.invoke('set-window-mode', mode),
  
  // 窗口控制
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
});
