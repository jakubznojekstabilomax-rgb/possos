const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const usb = require('usb'); // Dodana biblioteka do obsługi USB

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Zamiast ładować zdalną stronę, ładujemy lokalny plik
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Opcjonalnie, otworzenie narzędzi deweloperskich
    mainWindow.webContents.openDevTools();

    // Dodanie logiki obsługującej komunikację z drukarką USB
    ipcMain.on('print-receipt', async (event, receiptData) => {
        // Tutaj umieścimy logikę drukowania na drukarce USB
        // Założenie: receiptData zawiera dane do wydrukowania
        console.log("Otrzymano żądanie wydruku!");

        try {
            // Logika połączenia i drukowania przez USB
            const devices = usb.getDeviceList();
            const printer = devices.find(d => d.deviceDescriptor.idVendor === 0x04b8); // vendorId drukarki
            if (!printer) {
                console.error("Nie znaleziono drukarki USB.");
                return;
            }

            printer.open();
            printer.interfaces[0].claim();
            const endpoint = printer.interfaces[0].endpoints[0];

            // Wysyłanie danych do drukarki
            const data = Buffer.from(receiptData, 'utf-8');
            endpoint.transfer(data, (err) => {
                if (err) {
                    console.error("Błąd drukowania:", err);
                    event.sender.send('print-status', { success: false, error: err.message });
                } else {
                    console.log("Wydrukowano pomyślnie!");
                    event.sender.send('print-status', { success: true });
                }
                printer.close();
            });

        } catch (error) {
            console.error("Błąd połączenia z drukarką USB:", error);
            event.sender.send('print-status', { success: false, error: error.message });
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
