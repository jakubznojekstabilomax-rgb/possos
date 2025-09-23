const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Ustawienie obsługi zdarzenia połączenia Bluetooth
    mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
        event.preventDefault();
        
        if (deviceList.length > 0) {
            // W tym uproszczonym przykładzie wybieramy pierwsze urządzenie z listy
            callback(deviceList[0].deviceId);
        } else {
            callback('');
        }
    });

    // Ustawienie obsługi żądania uprawnień dla Bluetooth
    mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        if (permission === 'bluetooth') {
            callback(true);
        } else {
            callback(false);
        }
    });

    // Opcjonalnie: Otwórz narzędzia deweloperskie
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
