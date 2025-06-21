
const { app, BrowserWindow, Menu, Tray, ipcMain, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize secure store for configuration
const store = new Store({
  encryptionKey: 'housie-admin-secure-key-2024'
});

let mainWindow;
let tray;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent external navigation
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../public/icon.png');
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show HOUSIE Admin',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Emergency Controls',
      submenu: [
        {
          label: 'Emergency Disable Claude',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('emergency-action', 'disable-claude');
            }
          }
        },
        {
          label: 'Pause All Bookings',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('emergency-action', 'pause-bookings');
            }
          }
        },
        {
          label: 'Restore Normal Operations',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('emergency-action', 'restore-normal');
            }
          }
        }
      ]
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('HOUSIE Admin - Emergency Controls');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Refresh Controls',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('refresh-controls');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Emergency',
      submenu: [
        {
          label: 'Emergency Disable Claude',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('emergency-action', 'disable-claude');
            }
          }
        },
        {
          label: 'Pause All Bookings',
          accelerator: 'CmdOrCtrl+Shift+B',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('emergency-action', 'pause-bookings');
            }
          }
        },
        {
          label: 'Fraud Lockdown',
          accelerator: 'CmdOrCtrl+Shift+F',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('emergency-action', 'fraud-lockdown');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Restore Normal Operations',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('emergency-action', 'restore-normal');
            }
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers for secure configuration
ipcMain.handle('get-config', (event, key) => {
  return store.get(key);
});

ipcMain.handle('set-config', (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('delete-config', (event, key) => {
  store.delete(key);
  return true;
});

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createTray();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (tray) {
    tray.destroy();
  }
});
