const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getPorts: () => ipcRenderer.invoke('get-ports'),
  onRefresh: (cb) => ipcRenderer.on('refresh-ports', cb)
})
