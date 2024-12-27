"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        center: true
    });
    mainWindow.loadURL("file://".concat(__dirname, "/index.html"));
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
    mainWindow.webContents.openDevTools();
}
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});
