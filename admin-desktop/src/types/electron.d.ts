
export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  isElectron: boolean;
  storeCredentials: (credentials: { supabaseUrl: string; supabaseAnonKey: string }) => Promise<{ success: boolean; error?: string }>;
  getCredentials: () => Promise<{ success: boolean; credentials?: { supabaseUrl: string; supabaseAnonKey: string }; error?: string }>;
  clearCredentials: () => Promise<{ success: boolean; error?: string }>;
  validateCredentials: (credentials: { supabaseUrl: string; supabaseAnonKey: string }) => Promise<{ valid: boolean; error?: string }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
