
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Credentials {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface CredentialsContextType {
  credentials: Credentials | null;
  isLoading: boolean;
  isSetupComplete: boolean;
  saveCredentials: (credentials: Credentials) => Promise<boolean>;
  clearCredentials: () => Promise<void>;
  validateCredentials: (credentials: Credentials) => Promise<{ valid: boolean; error?: string }>;
}

const CredentialsContext = createContext<CredentialsContextType | undefined>(undefined);

export const CredentialsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    setIsLoading(true);
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.getCredentials();
        if (result.success && result.credentials) {
          setCredentials(result.credentials);
          setIsSetupComplete(true);
        } else {
          setIsSetupComplete(false);
        }
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
      setIsSetupComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCredentials = async (newCredentials: Credentials): Promise<boolean> => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.storeCredentials(newCredentials);
        if (result.success) {
          setCredentials(newCredentials);
          setIsSetupComplete(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error saving credentials:', error);
      return false;
    }
  };

  const clearCredentials = async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.clearCredentials();
        setCredentials(null);
        setIsSetupComplete(false);
      }
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  };

  const validateCredentials = async (creds: Credentials) => {
    try {
      if (window.electronAPI) {
        return await window.electronAPI.validateCredentials(creds);
      }
      return { valid: false, error: 'Electron API not available' };
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const value = {
    credentials,
    isLoading,
    isSetupComplete,
    saveCredentials,
    clearCredentials,
    validateCredentials,
  };

  return (
    <CredentialsContext.Provider value={value}>
      {children}
    </CredentialsContext.Provider>
  );
};

export const useCredentials = () => {
  const context = useContext(CredentialsContext);
  if (context === undefined) {
    throw new Error('useCredentials must be used within a CredentialsProvider');
  }
  return context;
};
