import * as path from "path";
import * as fs from "fs";

import { app, BrowserWindow } from "electron";

const isDev = !app.isPackaged;
let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 430,
    height: 932,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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

  // mainWindow.once("ready-to-show", () => {
  //   const testFilePath = "/Users/eduardorodriguezpatino/Downloads/track.wav";
  //   app.emit("open-file", {}, testFilePath);
  // });
}

app.on("ready", () => {
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

app.on("open-file", (event, filePath) => {
  const allowedExtensions = [".mp3", ".wav", ".flac", ".ogg"];

  if (!allowedExtensions.includes(path.extname(filePath).toLowerCase())) {
    console.error("Unsupported file type:", filePath);
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const blobData = Buffer.from(data).toString("base64");
    const fileName = path.basename(filePath);

    mainWindow!.webContents.send("file-opened", {
      blob: blobData,
      name: fileName,
    });
  });
});
