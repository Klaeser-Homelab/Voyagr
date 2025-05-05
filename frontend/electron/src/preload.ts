//require('./rt/electron-rt');
//////////////////////////////
// User Defined Preload scripts below
console.log('User Preload!');

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('electronAPI', {
    auth0Login: () => ipcRenderer.invoke('auth0-login'),
    // Add new token management methods
    getAuthToken: () => ipcRenderer.invoke('get-auth-token'),
    setAuthToken: (token) => ipcRenderer.invoke('set-auth-token', token),
    removeAuthToken: () => ipcRenderer.invoke('remove-auth-token')
  });
