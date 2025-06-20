
import { createClient } from '@supabase/supabase-js';

// Create a service role client for admin operations
const supabaseUrl = "https://dsfaxqfexebqogdxigdu.supabase.co";

// SECURITY: Get service role key from environment variables
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Critical security check
if (!supabaseServiceKey) {
  console.error('🚨 CRITICAL SECURITY ERROR: VITE_SUPABASE_SERVICE_ROLE_KEY environment variable is missing!');
  console.error('Please add your Supabase service role key to your environment variables.');
  throw new Error('Missing Supabase service role key - admin functions will not work');
}

// Warn if running in development with service role key
if (import.meta.env.DEV) {
  console.warn('⚠️  SERVICE ROLE KEY DETECTED IN DEVELOPMENT MODE');
  console.warn('Ensure this key is properly secured in production!');
}

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

export const adminService = {
  async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await adminSupabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Admin status check error:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  async updateUserSubscription(userId: string, newTier: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await adminSupabase
        .from('users')
        .update({ subscription_tier: newTier })
        .eq('id', userId);

      if (error) {
        console.error('Subscription update error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating subscription:', error);
      return { success: false, error: 'Une erreur est survenue' };
    }
  },

  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete from users table (this will cascade to related tables)
      const { error } = await adminSupabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('User deletion error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Une erreur est survenue' };
    }
  }
};
