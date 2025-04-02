const { app, BrowserWindow } = require("electron");
var mainWindow;
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile("landing/index.html");
});
