const { app, BrowserWindow, session } = require('electron'); // DODAJ "session"

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // Dodaj ten kod przed wczytaniem strony
  win.webContents.session.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    if (deviceList.length > 0) {
      // Wybierz pierwsze urządzenie z listy (lub pozwól użytkownikowi wybrać)
      callback(deviceList[0].deviceId);
    }
  });

  win.loadURL('https://poss.ct8.pl'); // Twoja strona

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
