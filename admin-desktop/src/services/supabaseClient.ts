
import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;
let isInitialized = false;

export const initializeSupabase = async () => {
  if (!window.electronAPI) {
    throw new Error('Electron API not available');
  }

  console.log('🔧 Initializing Supabase client...');

  const supabaseUrl = await window.electronAPI.getConfig('supabaseUrl');
  const serviceRoleKey = await window.electronAPI.getConfig('serviceRoleKey');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase configuration not found. Please configure your connection first.');
  }

  console.log('📋 Configuration loaded:', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!serviceRoleKey,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'none'
  });

  try {
    supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Test the connection by making a simple query
    console.log('🧪 Testing Supabase connection...');
    const { data, error } = await supabaseClient
      .from('emergency_controls')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    isInitialized = true;
    console.log('✅ Supabase client initialized and tested successfully');
    return supabaseClient;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    supabaseClient = null;
    isInitialized = false;
    throw error;
  }
};

export const getSupabaseClient = () => {
  if (!isInitialized || !supabaseClient) {
    throw new Error('Supabase client not initialized. Please configure your connection first.');
  }
  return supabaseClient;
};

export const isSupabaseInitialized = () => {
  return isInitialized && !!supabaseClient;
};

export const resetSupabaseClient = () => {
  console.log('🔄 Resetting Supabase client...');
  supabaseClient = null;
  isInitialized = false;
};
