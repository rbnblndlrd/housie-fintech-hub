
import { supabase } from '@/integrations/supabase/client';

export const adminService = {
  async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('check-admin-status', {
        body: { userId }
      });

      if (error) {
        console.error('Admin status check error:', error);
        return false;
      }

      return data?.isAdmin || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  async updateUserSubscription(userId: string, newTier: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('admin-update-subscription', {
        body: { userId, newTier }
      });

      if (error) {
        console.error('Subscription update error:', error);
        return { success: false, error: error.message };
      }

      return data || { success: true };
    } catch (error) {
      console.error('Error updating subscription:', error);
      return { success: false, error: 'Une erreur est survenue' };
    }
  },

  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId }
      });

      if (error) {
        console.error('User deletion error:', error);
        return { success: false, error: error.message };
      }

      return data || { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Une erreur est survenue' };
    }
  }
};
