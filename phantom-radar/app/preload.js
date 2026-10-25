const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('ble', {
  onDevice: (cb) => ipcRenderer.on('ble-device', (_e, d) => cb(d)),
  onState: (cb) => ipcRenderer.on('ble-state', (_e, d) => cb(d))
});
