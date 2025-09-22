const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // Dodaje funkcję obsługującą zdarzenia związane z Bluetooth.
  // Dzięki temu okno z listą urządzeń będzie mogło się pojawić.
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'bluetooth') {
      callback(true);
    } else {
      callback(false);
    }
  });

  win.webContents.session.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    if (deviceList.length > 0) {
      // Wybierz pierwsze urządzenie z listy. W bardziej zaawansowanej wersji,
      // tutaj mógłbyś wyświetlić okno dialogowe z listą urządzeń.
      callback(deviceList[0].deviceId);
    } else {
      callback('');
    }
  });

  // Załaduj Twoją stronę internetową. Pamiętaj, aby zmienić adres URL!
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
