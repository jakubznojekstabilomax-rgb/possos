const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true, // Zostawiamy włączone, to jest bezpieczniejsze
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    // Ładujemy lokalny plik HTML, który zawiera ramkę z Twoją stroną
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Ustawiamy obsługę żądania Bluetooth
    mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        if (permission === 'bluetooth') {
            callback(true);
        } else {
            callback(false);
        }
    });

    // Ustawiamy obsługę zdarzenia połączenia z urządzeniem
    mainWindow.webContents.session.on('select-bluetooth-device', (event, deviceList, callback) => {
        event.preventDefault();
        if (deviceList.length > 0) {
            callback(deviceList[0].deviceId);
        } else {
            callback('');
        }
    });
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
