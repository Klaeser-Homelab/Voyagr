import { BrowserWindow, ipcMain } from 'electron';
import { auth0Config } from './setup'; // Import auth0Config if needed

export function createLoginWindow(url: string): BrowserWindow {
  const loginWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  loginWindow.loadURL(url);

  loginWindow.webContents.on('did-navigate', (event, url) => {
    if (url.includes(auth0Config.redirectUri)) {
      console.log('Auth0 callback detected:', url);
      ipcMain.emit('auth0-callback', {}, url);
      setTimeout(() => loginWindow.close(), 500);
    }
  });

  return loginWindow;
} 