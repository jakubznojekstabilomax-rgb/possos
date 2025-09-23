const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { BluetoothSerialPort } = require('bluetooth-serial-port');
const btSerial = new BluetoothSerialPort();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false // Wyłączamy, aby wczytać zdalną stronę w iframe
        }
    });

    // Ładujemy lokalny plik HTML, który załaduje Twoją stronę
    mainWindow.loadFile('index.html');

    // To jest kluczowy kanał komunikacji!
    ipcMain.handle('connect-to-bluetooth-device', async (event) => {
        return new Promise((resolve, reject) => {
            btSerial.list(function(devices) {
                if (devices.length === 0) {
                    return resolve({ success: false, error: 'Nie znaleziono żadnych urządzeń Bluetooth.' });
                }

                // W tym przykładzie bierzemy pierwsze urządzenie
                const firstDevice = devices[0];
                const address = firstDevice.address;
                const channel = firstDevice.channel;

                btSerial.findSerialPortChannel(address, function(channel) {
                    if (channel === -1) {
                        return resolve({ success: false, error: 'Nie znaleziono kanału dla urządzenia.' });
                    }

                    btSerial.connect(address, channel, function() {
                        resolve({ success: true, message: 'Połączono z drukarką Bluetooth!' });
                    }, function () {
                        resolve({ success: false, error: 'Błąd połączenia z urządzeniem.' });
                    });
                }, function() {
                    resolve({ success: false, error: 'Błąd znajdowania kanału Bluetooth.' });
                });
            });
        });
    });

    ipcMain.handle('print-receipt', async (event, data) => {
        return new Promise((resolve, reject) => {
            if (!btSerial.isOpen()) {
                return resolve({ success: false, error: 'Brak połączenia z drukarką.' });
            }

            btSerial.write(Buffer.from(data, 'utf-8'), function(err, bytesWritten) {
                if (err) {
                    return resolve({ success: false, error: err.message });
                }
                btSerial.close();
                resolve({ success: true, message: 'Wydrukowano pomyślnie!' });
            });
        });
    });

    // Upewnij się, że masz ten kod do obsługi uprawnień!
    mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        if (permission === 'bluetooth') {
            callback(true);
        } else {
            callback(false);
        }
    });
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
