const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electronAPI', {
        connectToBluetoothDevice: () => ipcRenderer.invoke('connect-to-bluetooth'),
    }
);
