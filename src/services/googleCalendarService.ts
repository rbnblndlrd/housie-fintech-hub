
import { supabase } from '@/integrations/supabase/client';
import { GoogleCalendarToken } from '@/types/googleCalendar';

export class GoogleCalendarService {
  static async checkConnection(userId: string): Promise<{ tokenData: GoogleCalendarToken | null; isConnected: boolean }> {
    try {
      const { data, error } = await supabase
        .from('google_calendar_tokens')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking calendar connection:', error);
        return { tokenData: null, isConnected: false };
      }

      if (data) {
        // Check if token is expired
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        
        if (expiresAt <= now) {
          console.log('Token expired, needs refresh...');
        }
        
        return { tokenData: data, isConnected: true };
      }

      return { tokenData: null, isConnected: false };
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      return { tokenData: null, isConnected: false };
    }
  }

  static async exchangeCodeForTokens(code: string, userId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('google-calendar-auth', {
      body: {
        action: 'exchange_code',
        code: code,
        user_id: userId,
      },
    });

    if (error) throw error;
  }

  static async refreshAccessToken(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: {
          action: 'refresh_token',
          user_id: userId,
        },
      });

      if (error) throw error;
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  static async disconnectCalendar(userId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('google-calendar-auth', {
      body: {
        action: 'disconnect',
        user_id: userId,
      },
    });

    if (error) throw error;
  }
}
