import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  onFileOpened: (callback) => {
    ipcRenderer.on("file-opened", (event, file) => {
      callback(file);
    });
  },
});
