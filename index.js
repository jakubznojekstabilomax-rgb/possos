const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false,
      bluetooth: true
    }
  });

  // Dodaje funkcję obsługującą zdarzenia związane z Bluetooth
  win.webContents.session.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();

    if (deviceList.length > 0) {
      // W normalnej aplikacji, tutaj wyświetliłbyś okno dialogowe z listą urządzeń.
      // Na razie, na potrzeby testów, wybieramy pierwsze urządzenie.
      callback(deviceList[0].deviceId);
    } else {
      callback(''); // Informacja o braku urządzeń
    }
  });

  // Załadowanie Twojej strony internetowej. Pamiętaj, aby zmienić adres URL!
  win.loadURL('https://poss.ct8.pl');
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
