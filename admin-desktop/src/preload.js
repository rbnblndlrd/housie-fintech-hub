
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Credential management
  storeCredentials: (credentials) => ipcRenderer.invoke('store-credentials', credentials),
  getCredentials: () => ipcRenderer.invoke('get-credentials'),
  clearCredentials: () => ipcRenderer.invoke('clear-credentials'),
  validateCredentials: (credentials) => ipcRenderer.invoke('validate-credentials', credentials),
  
  // Electron detection
  isElectron: true
});
