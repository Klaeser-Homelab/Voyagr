import type { CapacitorElectronConfig } from '@capacitor-community/electron';
import { getCapacitorElectronConfig, setupElectronDeepLinking } from '@capacitor-community/electron';
import type { MenuItemConstructorOptions } from 'electron';
import { app, MenuItem, ipcMain } from 'electron'; // Add ipcMain here
import electronIsDev from 'electron-is-dev';
import unhandled from 'electron-unhandled';
import { autoUpdater } from 'electron-updater';
import authService from './services/authService';

// Import your createBrowserViewWindow function

import { ElectronCapacitorApp, setupContentSecurityPolicy, setupReloadWatcher } from './setup';

// Graceful handling of unhandled errors.
unhandled();

// Define our menu templates (these are optional)
const trayMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [new MenuItem({ label: 'Quit App', role: 'quit' })];
const appMenuBarMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
  { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
  { role: 'viewMenu' },
];

// Get Config options from capacitor.config
const capacitorFileConfig: CapacitorElectronConfig = getCapacitorElectronConfig();

// Initialize our app. You can pass menu templates into the app here.
// const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig);
const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig, trayMenuTemplate, appMenuBarMenuTemplate);

// If deeplinking is enabled then we will set it up here.
if (capacitorFileConfig.electron?.deepLinkingEnabled) {
  setupElectronDeepLinking(myCapacitorApp, {
    customProtocol: capacitorFileConfig.electron.deepLinkingCustomProtocol ?? 'mycapacitorapp',
  });
}

// If we are in Dev mode, use the file watcher components.
if (electronIsDev) {
  setupReloadWatcher(myCapacitorApp);
}

// Run Application
(async () => {
  // Wait for electron app to be ready.
  await app.whenReady();
  // Security - Set Content-Security-Policy based on whether or not we are in dev mode.
  setupContentSecurityPolicy(myCapacitorApp.getCustomURLScheme());

  ipcMain.on('auth-complete', (event, url) => {
    console.log('Auth0 callback data received:', url);
    myCapacitorApp.getMainWindow().loadURL(url);
  });
  
  // Set up IPC handlers - add them here after app is ready
  ipcMain.handle('open-gmail', async () => {
    try {
      // Create a browser view window with Gmail
      myCapacitorApp.openBrowserView('https://mail.google.com');
      
      // Return success message
      return { success: true, message: 'Gmail window opened successfully' };
    } catch (error) {
      console.error('Error opening Gmail:', error);
      return { success: false, error: error.message };
    }
  });

    // Set up IPC handlers - add them here after app is ready
    ipcMain.handle('auth0-login', async () => {
      try {

        const session = require('electron').session;
        await session.defaultSession.clearStorageData({
          storages: ['cookies', 'localStorage', 'sessionStorage', 'cachestorage']
        });
        
        console.log('Cleared session data and cookies');

        // Create a browser view window with Gmail
        myCapacitorApp.openBrowserView('capacitor-electron://-/electronlogin');
        
        // Return success message
        return { success: true, message: 'Auth0 Login window opened successfully' };
      } catch (error) {
        console.error('Error opening Auth0 Login:', error);
        return { success: false, error: error.message };
      }
    });
  
  // Initialize our app, build windows, and load content.
  await myCapacitorApp.init();
  // Check for updates if we are in a packaged app.
  autoUpdater.checkForUpdatesAndNotify();

  //myCapacitorApp.openBrowserView('https://mail.google.com');
})();

// During app initialization
app.whenReady().then(() => {
  // ... your existing setup
  
  // Get the main window
  const mainWindow = myCapacitorApp.getMainWindow();
  
  // Set up the close handler early
  mainWindow.on('close', (event) => {
    // This should run before the window is destroyed
    event.preventDefault();
    console.log('clearing storage data - from window close event');
    
    try {
      mainWindow.webContents.session.clearStorageData({
        storages: ['localstorage', 'cachestorage', 'cookies']
      });
      console.log('Storage cleared successfully');
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
    
    // Allow a moment for the operation to complete
    setTimeout(() => mainWindow.destroy(), 100);
  });
});

// Handle when all of our windows are close (platforms have their own expectations).
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// When the dock icon is clicked.
app.on('activate', async function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) {
    await myCapacitorApp.init();
  }
});

// Place all ipc or other electron api calls and custom functionality under this line