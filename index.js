const { app, BrowserWindow, session } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      bluetooth: true, // Zapewnia dostęp do API Bluetooth
      enableRemoteModule: false
    }
  });

  // Dodaj tę funkcję, aby umożliwić dostęp do Bluetooth
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'bluetooth') {
      callback(true); // Zawsze zezwalaj na dostęp do Bluetooth
    } else {
      callback(false);
    }
  });

  win.webContents.session.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    if (deviceList.length > 0) {
      callback(deviceList[0].deviceId);
    } else {
      callback('');
    }
  });

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
