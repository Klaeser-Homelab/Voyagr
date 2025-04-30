import type { CapacitorElectronConfig } from '@capacitor-community/electron';
import {
  CapElectronEventEmitter,
  CapacitorSplashScreen,
  setupCapacitorElectronPlugins,
} from '@capacitor-community/electron';
import chokidar from 'chokidar';
import type { MenuItemConstructorOptions } from 'electron';
import { app, BrowserWindow, Menu, MenuItem, nativeImage, Tray, session, BrowserView } from 'electron';
import electronIsDev from 'electron-is-dev';
import electronServe from 'electron-serve';
import windowStateKeeper from 'electron-window-state';
import { join } from 'path';
import { ipcMain } from 'electron';
import { createLoginWindow } from './loginWindow';
// Define components for a watcher to detect when the webapp is changed so we can reload in Dev mode.
const reloadWatcher = {
  debouncer: null,
  ready: false,
  watcher: null,
};
export function setupReloadWatcher(electronCapacitorApp: ElectronCapacitorApp): void {
  reloadWatcher.watcher = chokidar
    .watch(join(app.getAppPath(), 'app'), {
      ignored: /[/\\]\./,
      persistent: true,
    })
    .on('ready', () => {
      reloadWatcher.ready = true;
    })
    .on('all', (_event, _path) => {
      if (reloadWatcher.ready) {
        clearTimeout(reloadWatcher.debouncer);
        reloadWatcher.debouncer = setTimeout(async () => {
          electronCapacitorApp.getMainWindow().webContents.reload();
          reloadWatcher.ready = false;
          clearTimeout(reloadWatcher.debouncer);
          reloadWatcher.debouncer = null;
          reloadWatcher.watcher = null;
          setupReloadWatcher(electronCapacitorApp);
        }, 1500);
      }
    });
}

export const auth0Config = {
  clientId: 'lpTd0GzL3Qmr2ACZ6CcT1rMN3nkqh1gu',
  domain: 'dev-m0q23jbgtbwidn00.us.auth0.com',
  redirectUri: 'capacitor-electron://-/callback',
  audience: 'https://dev-m0q23jbgtbwidn00.us.auth0.com/api/v2/',
  scope: 'openid profile email'
};

/**
 * Creates a new window with a BrowserView showing the specified URL
 * @param url The URL to load in the BrowserView
 * @param width The width of the window
 * @param height The height of the window
 * @returns The created BrowserWindow instance
 */
export function createBrowserViewWindow(url: string, width = 800, height = 600): BrowserWindow {
  // Create window state keeper for this window
  const browserViewWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
    file: 'browser-view-window-state.json',
  });

  // Create a new BrowserWindow
  const win = new BrowserWindow({ 
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
          "connect-src 'self' https://*.google.com https://accounts.google.com https://mail.google.com https://*.googleapis.com https://*.auth0.com;"
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

  // Listen for URL changes to detect the callback
  view.webContents.on('did-navigate', (event, url) => {
    if (url.includes(auth0Config.redirectUri)) {
      console.log('Auth0 callback detected:', url);
      
      // Inject script to send the callback
      ipcMain.emit('auth0-callback', {}, url);
      
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

// Define our class to manage our app.
export class ElectronCapacitorApp {
  private MainWindow: BrowserWindow | null = null;
  private SplashScreen: CapacitorSplashScreen | null = null;
  private TrayIcon: Tray | null = null;
  private CapacitorFileConfig: CapacitorElectronConfig;
  private TrayMenuTemplate: (MenuItem | MenuItemConstructorOptions)[] = [
    new MenuItem({ label: 'Quit App', role: 'quit' }),
  ];
  private AppMenuBarMenuTemplate: (MenuItem | MenuItemConstructorOptions)[] = [
    { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
    { role: 'viewMenu' },
  ];
  private mainWindowState;
  private loadWebApp;
  private customScheme: string;

  constructor(
    capacitorFileConfig: CapacitorElectronConfig,
    trayMenuTemplate?: (MenuItemConstructorOptions | MenuItem)[],
    appMenuBarMenuTemplate?: (MenuItemConstructorOptions | MenuItem)[]
  ) {
    this.CapacitorFileConfig = capacitorFileConfig;

    this.customScheme = this.CapacitorFileConfig.electron?.customUrlScheme ?? 'capacitor-electron';

    if (trayMenuTemplate) {
      this.TrayMenuTemplate = trayMenuTemplate;
    }

    if (appMenuBarMenuTemplate) {
      this.AppMenuBarMenuTemplate = appMenuBarMenuTemplate;
    }

    // Setup our web app loader, this lets us load apps like react, vue, and angular without changing their build chains.
    this.loadWebApp = electronServe({
      directory: join(app.getAppPath(), 'app'),
      scheme: this.customScheme,
    });
  }

  // Helper function to load in the app.
  private async loadMainWindow(thisRef: any) {
    await thisRef.loadWebApp(thisRef.MainWindow);
  }

  // Expose the mainWindow ref for use outside of the class.
  getMainWindow(): BrowserWindow {
    return this.MainWindow;
  }

  getCustomURLScheme(): string {
    return this.customScheme;
  }

  openBrowserView(url: string): BrowserWindow {
    return createBrowserViewWindow(url);
  }

  async init(): Promise<void> {
    const icon = nativeImage.createFromPath(
      join(app.getAppPath(), 'assets', process.platform === 'win32' ? 'appIcon.ico' : 'appIcon.png')
    );
    this.mainWindowState = windowStateKeeper({
      defaultWidth: 1000,
      defaultHeight: 800,
    });
    // Setup preload script path and construct our main window.
    this.MainWindow = new BrowserWindow({
      icon,
      show: false,
      x: this.mainWindowState.x,
      y: this.mainWindowState.y,
      width: this.mainWindowState.width,
      height: this.mainWindowState.height,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        // Use preload to inject the electron varriant overrides for capacitor plugins.
        // preload: join(app.getAppPath(), "node_modules", "@capacitor-community", "electron", "dist", "runtime", "electron-rt.js"),
        preload: join(app.getAppPath(), 'build', 'src', 'preload.js')
      },
    });
    this.mainWindowState.manage(this.MainWindow);

    if (this.CapacitorFileConfig.backgroundColor) {
      this.MainWindow.setBackgroundColor(this.CapacitorFileConfig.electron.backgroundColor);
    }

    // If we close the main window with the splashscreen enabled we need to destory the ref.
    this.MainWindow.on('closed', () => {
      if (this.SplashScreen?.getSplashWindow() && !this.SplashScreen.getSplashWindow().isDestroyed()) {
        this.SplashScreen.getSplashWindow().close();
      }
    });

    // When the tray icon is enabled, setup the options.
    if (this.CapacitorFileConfig.electron?.trayIconAndMenuEnabled) {
      this.TrayIcon = new Tray(icon);
      this.TrayIcon.on('double-click', () => {
        if (this.MainWindow) {
          if (this.MainWindow.isVisible()) {
            this.MainWindow.hide();
          } else {
            this.MainWindow.show();
            this.MainWindow.focus();
          }
        }
      });
      this.TrayIcon.on('click', () => {
        if (this.MainWindow) {
          if (this.MainWindow.isVisible()) {
            this.MainWindow.hide();
          } else {
            this.MainWindow.show();
            this.MainWindow.focus();
          }
        }
      });
      this.TrayIcon.setToolTip(app.getName());
      this.TrayIcon.setContextMenu(Menu.buildFromTemplate(this.TrayMenuTemplate));
    }

    // Setup the main manu bar at the top of our window.
    Menu.setApplicationMenu(Menu.buildFromTemplate(this.AppMenuBarMenuTemplate));

    // If the splashscreen is enabled, show it first while the main window loads then switch it out for the main window, or just load the main window from the start.
    if (this.CapacitorFileConfig.electron?.splashScreenEnabled) {
      this.SplashScreen = new CapacitorSplashScreen({
        imageFilePath: join(
          app.getAppPath(),
          'assets',
          this.CapacitorFileConfig.electron?.splashScreenImageName ?? 'splash.png'
        ),
        windowWidth: 400,
        windowHeight: 400,
      });
      this.SplashScreen.init(this.loadMainWindow, this);
    } else {
      this.loadMainWindow(this);
    }

    // Security
    this.MainWindow.webContents.setWindowOpenHandler((details) => {
      if (!details.url.includes(this.customScheme)) {
        return { action: 'deny' };
      } else {
        return { action: 'allow' };
      }
    });
    this.MainWindow.webContents.on('will-navigate', (event, _newURL) => {
      if (!this.MainWindow.webContents.getURL().includes(this.customScheme)) {
        event.preventDefault();
      }
    });

    // Link electron plugins into the system.
    setupCapacitorElectronPlugins();

    // When the web app is loaded we hide the splashscreen if needed and show the mainwindow.
    this.MainWindow.webContents.on('dom-ready', () => {
      if (this.CapacitorFileConfig.electron?.splashScreenEnabled) {
        this.SplashScreen.getSplashWindow().hide();
      }
      if (!this.CapacitorFileConfig.electron?.hideMainWindowOnLaunch) {
        this.MainWindow.show();
      }
      setTimeout(() => {
        if (electronIsDev) {
          this.MainWindow.webContents.openDevTools();
        }
        CapElectronEventEmitter.emit('CAPELECTRON_DeeplinkListenerInitialized', '');
      }, 400);
    });
  }
}

// Set a CSP up for our application based on the custom scheme
export function setupContentSecurityPolicy(customScheme: string): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          electronIsDev
            ? `default-src ${customScheme}://* 'unsafe-inline' devtools://* 'unsafe-eval' data:`
            : `default-src ${customScheme}://* 'unsafe-inline' data:`,
        ],
      },
    });
  });
}
