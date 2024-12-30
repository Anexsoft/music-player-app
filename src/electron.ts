import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null;
let fileToOpen: string | undefined;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 430,
    height: 932,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.once("did-finish-load", () => {
    if (fileToOpen) {
      mainWindow?.webContents.send("file-opened", fileToOpen);
    }
  });

  mainWindow.webContents.openDevTools();
}

app.on("ready", () => {
  const args = process.argv.slice(1);
  const fileArg = args.find((arg) => !arg.startsWith("-"));
  if (fileArg) {
    fileToOpen = fileArg;
  }
  createWindow();
});

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
