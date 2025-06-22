
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  isElectron: true,
  
  // Secure credential storage
  storeCredentials: (credentials) => ipcRenderer.invoke('store-credentials', credentials),
  getCredentials: () => ipcRenderer.invoke('get-credentials'),
  clearCredentials: () => ipcRenderer.invoke('clear-credentials'),
  validateCredentials: (credentials) => ipcRenderer.invoke('validate-credentials', credentials)
});
