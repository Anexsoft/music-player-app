type ElectronApiOnFileOpendProps = {
  blob: string;
  name: string;
};

export interface ElectronAPI {
  onFileOpened: (callback: (file: ElectronApiOnFileOpendProps) => void) => void;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}
