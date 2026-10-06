import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const isDev = !app.isPackaged;

  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, isDev ? '../public/icon.png' : '../dist/icon.png'),
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: true,
      contextIsolation: true
    },
  });

  // Menghilangkan menu default
  win.removeMenu();

  if (isDev) {
    // Vite dev server URL
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// IPC: Auto-startup (Login Item) settings
ipcMain.handle('get-login-item-settings', () => {
  return app.getLoginItemSettings();
});

ipcMain.handle('set-login-item-settings', (_event, openAtLogin) => {
  app.setLoginItemSettings({ openAtLogin });
  return app.getLoginItemSettings();
});

app.whenReady().then(() => {
  createWindow();

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
