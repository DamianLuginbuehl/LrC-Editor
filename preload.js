const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    minimizeMain: () => ipcRenderer.send('mainWindow-minimize'),
    maximizeMain: () => ipcRenderer.send('mainWindow-maximize'),
    closeMain: () => ipcRenderer.send('mainWindow-close'),
    openGallerySetup: () => ipcRenderer.send('open-gallery-setup'),
    closeGallerySetup: () => ipcRenderer.send('gallerySetupWindow-close'),
    getAllGalleries: () => ipcRenderer.invoke('get-all-galleries'),
    sendMessage: (msg) => ipcRenderer.send('send-message', msg),
    onMessage: (callback) => ipcRenderer.on('receive-message', (event, data) => callback(data))
});