import { app, BrowserWindow, Menu, MenuItem, nativeImage, Tray, session, BrowserView } from 'electron';
import windowStateKeeper from 'electron-window-state';
import { ipcMain } from 'electron';
import { join } from 'path';
import authService from './services/authService';


let win = null;

/**
 * Creates a new window with a BrowserView showing the specified URL
 * @param url The URL to load in the BrowserView
 * @param width The width of the window
 * @param height The height of the window
 * @returns The created BrowserWindow instance
 */
export function createLoginWindow(url: string, width = 800, height = 600): BrowserWindow {
  destroyAuthWin();

  // Create window state keeper for this window
  const browserViewWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
    file: 'browser-view-window-state.json',
  });

  // Create a new BrowserWindow
  win = new BrowserWindow({ 
    icon: nativeImage.createFromPath(
      join(app.getAppPath(), 'assets', process.platform === 'win32' ? 'appIcon.ico' : 'appIcon.png')
    ),
    title: 'Web Browser View',
    show: false,
    x: browserViewWindowState.x,
    y: browserViewWindowState.y,
    width: browserViewWindowState.width,
    height: browserViewWindowState.height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true    }
  });
  
  // Manage window state
  browserViewWindowState.manage(win);
  
  // Create a BrowserView to fill the whole window
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // We don't need to use the Capacitor preload script for this view
      // as it's just displaying an external website
    }
  });
  
  // Set a targeted CSP for the Electron.js website
  view.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' https://*.google.com https://accounts.google.com https://mail.google.com https://*.auth0.com; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://accounts.google.com https://mail.google.com https://*.googleapis.com https://*.auth0.com; " +
          "style-src 'self' 'unsafe-inline' https://*.google.com https://accounts.google.com https://mail.google.com https://*.googleapis.com https://*.auth0.com; " +
          "img-src 'self' data: https://*.google.com https://accounts.google.com https://mail.google.com https://*.gstatic.com https://*.googleusercontent.com https://*.auth0.com; " +
          "font-src 'self' https://*.google.com https://accounts.google.com https://mail.google.com https://*.googleapis.com https://*.gstatic.com https://*.auth0.com; " +
          "connect-src 'self' https://*.google.com https://accounts.google.com https://mail.google.com https://*.googleapis.com https://*.auth0.com https://voyagr.me;"
        ],
      }
    });
  });
  
  // Add the view to the window
  win.setBrowserView(view);
  
  // Set the bounds to fill the entire window
  const bounds = win.getBounds();
  view.setBounds({ 
    x: 0, 
    y: 0, 
    width: bounds.width, 
    height: bounds.height 
  });
  
  // Load the specified URL
  view.webContents.loadURL(url);

  
  // Open DevTools for debugging CSP issues if needed
  view.webContents.openDevTools();
  
  // Show the window when content has finished loading
  view.webContents.on('did-finish-load', () => {
    win.show();
  });

  const {session: {webRequest}} = win.webContents


/*
  webRequest.onBeforeRequest(filter, async ({url}) => {
    if (url.includes(authService.auth0Config.redirectUri)) {
      await authService.loadTokens(url);
      ipcMain.emit('auth0-callback', {}, authService.auth0Config.homeUrl);
      return destroyAuthWin();
    }
  });
 */
  // Listen for URL changes to detect the callback
  
  view.webContents.on('did-navigate-in-page', (event, url) => {
    if (url.includes('/home')) {
      
      // Inject script to send the callback
      ipcMain.emit('auth-complete', {}, url);
      
      // Close window after a small delay
      setTimeout(() => win.close(), 500);
    }
  });
 
  // Update the view size when the window is resized
  win.on('resize', () => {
    const bounds = win.getBounds();
    view.setBounds({ 
      x: 0, 
      y: 0, 
      width: bounds.width, 
      height: bounds.height 
    });
  });

  // Add security restriction for opening links
  view.webContents.setWindowOpenHandler((details) => {
    // Open links in the default browser
    require('electron').shell.openExternal(details.url);
    return { action: 'deny' };
  });
  
  return win;
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}
