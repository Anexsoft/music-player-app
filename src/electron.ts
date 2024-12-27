import { app, BrowserWindow } from "electron";

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    center: true,
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
