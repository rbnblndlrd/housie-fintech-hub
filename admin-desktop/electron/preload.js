
const { contextBridge, ipcRenderer } = require('electron');

// Expose secure API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Configuration management
  getConfig: (key) => ipcRenderer.invoke('get-config', key),
  setConfig: (key, value) => ipcRenderer.invoke('set-config', key, value),
  deleteConfig: (key) => ipcRenderer.invoke('delete-config', key),
  
  // Emergency action listeners
  onEmergencyAction: (callback) => {
    ipcRenderer.on('emergency-action', (event, action) => callback(action));
  },
  
  // Refresh controls listener
  onRefreshControls: (callback) => {
    ipcRenderer.on('refresh-controls', () => callback());
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
