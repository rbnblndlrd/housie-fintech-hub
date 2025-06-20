
import { createClient } from '@supabase/supabase-js';

// Create a service role client for admin operations
const supabaseUrl = "https://dsfaxqfexebqogdxigdu.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZmF4cWZleGVicW9nZHhpZ2R1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDEyOTMwNywiZXhwIjoyMDY1NzA1MzA3fQ.Wl3hf0_h8Ov4ZqQT8xKUn2aJJ9xK5vY3mF2sT9wLxE8"; // This should be stored securely

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
