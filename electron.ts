import { app, BrowserWindow } from "electron";
import * as path from "path";
import { ipcMain, dialog } from "electron";

const isDev = !app.isPackaged;
let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 430,
    height: 932,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  ipcMain.handle("upload-file", async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ["openFile"],
    });

    if (result.canceled) {
      return null;
    } else {
      return result.filePaths[0];
    }
  });
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
