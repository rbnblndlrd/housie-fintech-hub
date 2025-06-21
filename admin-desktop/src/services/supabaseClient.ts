
import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export const initializeSupabase = async () => {
  if (!window.electronAPI) {
    throw new Error('Electron API not available');
  }

  const supabaseUrl = await window.electronAPI.getConfig('supabaseUrl');
  const serviceRoleKey = await window.electronAPI.getConfig('serviceRoleKey');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase configuration not found');
  }

  supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return supabaseClient;
};

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized');
  }
  return supabaseClient;
};
