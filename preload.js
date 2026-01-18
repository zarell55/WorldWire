const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browser', {
  navigate: (input, engine) =>
    ipcRenderer.send('navigate', { input, engine }),
  back: () => ipcRenderer.send('back'),
  forward: () => ipcRenderer.send('forward'),
  reload: () => ipcRenderer.send('reload'),
  newTab: () => ipcRenderer.send('new-tab'),
  switchTab: i => ipcRenderer.send('switch-tab', i)
});
