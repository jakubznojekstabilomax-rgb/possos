const { app, BrowserWindow, session } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      bluetooth: true
    }
  });

  // Ten fragment kodu pozwala na komunikację z urządzeniami Bluetooth
  win.webContents.session.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    if (deviceList.length > 0) {
      // Wybierz pierwsze urządzenie z listy.
      callback(deviceList[0].deviceId);
    } else {
      callback('');
    }
  });

  // Dodatkowo, ten kod pozwala na wyświetlanie okna dialogowego z listą urządzeń Bluetooth
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'bluetooth') {
      callback(true); // Zezwól na dostęp do Bluetooth
    } else {
      callback(false); // Zablokuj inne uprawnienia
    }
  });

  // Załadowanie Twojej strony internetowej. Adres URL jest już zmieniony!
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
