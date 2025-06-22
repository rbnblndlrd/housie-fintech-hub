
/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI?: {
      getAppVersion: () => Promise<string>;
      getPlatform: () => Promise<string>;
      isElectron: boolean;
    };
    DESKTOP_MODE?: boolean;
  }
}

export {};
