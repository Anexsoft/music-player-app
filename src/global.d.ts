export interface ElectronAPI {
  onFileOpened: (callback: (path: string) => void) => void;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}
