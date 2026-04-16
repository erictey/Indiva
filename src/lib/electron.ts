// Type-safe bridge to Electron APIs exposed via preload
declare global {
  interface Window {
    electronAPI?: {
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      toggleFullscreen: () => Promise<void>;
      getAutostart: () => Promise<boolean>;
      setAutostart: (enabled: boolean) => Promise<boolean>;
    };
  }
}

export const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

export function windowMinimize() {
  window.electronAPI?.minimize();
}

export function windowMaximize() {
  window.electronAPI?.maximize();
}

export function windowClose() {
  window.electronAPI?.close();
}

export async function windowIsMaximized() {
  return (await window.electronAPI?.isMaximized()) ?? false;
}

export function windowToggleFullscreen() {
  window.electronAPI?.toggleFullscreen();
}

export async function getAutostart() {
  return (await window.electronAPI?.getAutostart()) ?? false;
}

export async function setAutostart(enabled: boolean) {
  return (await window.electronAPI?.setAutostart(enabled)) ?? false;
}
