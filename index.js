const { app, BrowserWindow, session } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.webContents.session.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();

    // Możesz tutaj stworzyć okno dialogowe, aby pokazać listę urządzeń
    // i pozwolić użytkownikowi wybrać, z którym chce się połączyć.
    // Na razie, na potrzeby testów, wybierzemy pierwsze urządzenie.
    if (deviceList.length > 0) {
        callback(deviceList[0].deviceId);
    } else {
        // Jeśli nie ma urządzeń, poinformuj o tym
        callback(''); // Brak urządzenia
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
