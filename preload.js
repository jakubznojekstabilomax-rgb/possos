const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electronAPI', {
        connectToBluetoothDevice: () => ipcRenderer.invoke('connect-to-bluetooth-device'),
        printReceipt: (data) => ipcRenderer.invoke('print-receipt', data)
    }
);
