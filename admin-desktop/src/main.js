
const { app, BrowserWindow, Menu, ipcMain, shell, safeStorage } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(__dirname, '../assets/icon.png'),
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

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'Housie Admin',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
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

app.whenReady().then(() => {
  createWindow();
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

// Secure storage for credentials
const STORAGE_KEY = 'housie-admin-credentials';

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-platform', () => {
  return process.platform;
});

// Secure credential storage handlers
ipcMain.handle('store-credentials', async (event, credentials) => {
  try {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Encryption not available on this system');
    }
    
    const encryptedData = safeStorage.encryptString(JSON.stringify(credentials));
    // Store in app's user data directory
    const fs = require('fs');
    const storageDir = app.getPath('userData');
    const storagePath = path.join(storageDir, `${STORAGE_KEY}.dat`);
    
    fs.writeFileSync(storagePath, encryptedData);
    return { success: true };
  } catch (error) {
    console.error('Error storing credentials:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-credentials', async () => {
  try {
    const fs = require('fs');
    const storageDir = app.getPath('userData');
    const storagePath = path.join(storageDir, `${STORAGE_KEY}.dat`);
    
    if (!fs.existsSync(storagePath)) {
      return { success: false, error: 'No credentials stored' };
    }
    
    const encryptedData = fs.readFileSync(storagePath);
    
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Encryption not available on this system');
    }
    
    const decryptedString = safeStorage.decryptString(encryptedData);
    const credentials = JSON.parse(decryptedString);
    
    return { success: true, credentials };
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('clear-credentials', async () => {
  try {
    const fs = require('fs');
    const storageDir = app.getPath('userData');
    const storagePath = path.join(storageDir, `${STORAGE_KEY}.dat`);
    
    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing credentials:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validate-credentials', async (event, credentials) => {
  try {
    // Basic validation
    if (!credentials.supabaseUrl || !credentials.supabaseAnonKey) {
      return { valid: false, error: 'Missing required credentials' };
    }
    
    // URL validation
    try {
      new URL(credentials.supabaseUrl);
    } catch {
      return { valid: false, error: 'Invalid Supabase URL format' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
});
