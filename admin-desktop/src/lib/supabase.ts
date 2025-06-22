
import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const createSupabaseClient = (supabaseUrl: string, supabaseAnonKey: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

export const getSupabase = () => {
  if (!supabaseInstance) {
    throw new Error('Supabase client not initialized. Please set up your credentials first.');
  }
  return supabaseInstance;
};

// For backward compatibility, try to get credentials from electronAPI
export const initializeSupabase = async () => {
  try {
    if (window.electronAPI) {
      const result = await window.electronAPI.getCredentials();
      if (result.success && result.credentials) {
        return createSupabaseClient(
          result.credentials.supabaseUrl,
          result.credentials.supabaseAnonKey
        );
      }
    }
    throw new Error('No credentials available');
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    throw error;
  }
};

// Legacy export for components that expect it
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabase();
    return client[prop as keyof typeof client];
  }
});
