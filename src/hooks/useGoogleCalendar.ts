
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GoogleCalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string;
  scope: string;
  created_at: string;
  updated_at: string;
}

interface UseGoogleCalendarReturn {
  isConnected: boolean;
  isLoading: boolean;
  connectCalendar: () => void;
  disconnectCalendar: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  tokenData: GoogleCalendarToken | null;
}

export const useGoogleCalendar = (): UseGoogleCalendarReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenData, setTokenData] = useState<GoogleCalendarToken | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkConnection = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('google_calendar_tokens')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking calendar connection:', error);
        setIsConnected(false);
        setTokenData(null);
      } else if (data) {
        setIsConnected(true);
        setTokenData(data);
        
        // Check if token is expired
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        
        if (expiresAt <= now) {
          console.log('Token expired, attempting refresh...');
          await refreshToken();
        }
      } else {
        setIsConnected(false);
        setTokenData(null);
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      setIsConnected(false);
      setTokenData(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const connectCalendar = useCallback(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your Google Calendar.",
        variant: "destructive",
      });
      return;
    }

    const clientId = Deno.env.get('GOOGLE_CLIENT_ID') || 'YOUR_GOOGLE_CLIENT_ID';
    const redirectUri = `https://dsfaxqfexebqogdxigdu.supabase.co/functions/v1/google-calendar-auth`;
    const scope = 'https://www.googleapis.com/auth/calendar';
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    authUrl.searchParams.append('state', JSON.stringify({ user_id: user.id }));

    // Open popup window for OAuth
    const popup = window.open(
      authUrl.toString(),
      'google-calendar-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for popup messages
    const messageListener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_CALENDAR_AUTH_SUCCESS') {
        popup?.close();
        window.removeEventListener('message', messageListener);
        
        try {
          // Exchange code for tokens
          const { error } = await supabase.functions.invoke('google-calendar-auth', {
            body: {
              action: 'exchange_code',
              code: event.data.code,
              user_id: user.id,
            },
          });

          if (error) throw error;

          toast({
            title: "Succès!",
            description: "Google Calendar connecté avec succès.",
          });
          
          await checkConnection();
        } catch (error) {
          console.error('Error exchanging code:', error);
          toast({
            title: "Connexion échouée",
            description: "Impossible de connecter Google Calendar. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      }
    };

    window.addEventListener('message', messageListener);
  }, [user, toast, checkConnection]);

  const disconnectCalendar = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { error } = await supabase.functions.invoke('google-calendar-auth', {
        body: {
          action: 'disconnect',
          user_id: user.id,
        },
      });

      if (error) throw error;

      setIsConnected(false);
      setTokenData(null);
      
      toast({
        title: "Déconnecté",
        description: "Google Calendar a été déconnecté.",
      });
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter Google Calendar.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (!user || !tokenData) return null;

    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: {
          action: 'refresh_token',
          user_id: user.id,
        },
      });

      if (error) throw error;

      // Update local state
      await checkConnection();
      
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, disconnect the calendar
      setIsConnected(false);
      setTokenData(null);
      return null;
    }
  }, [user, tokenData, checkConnection]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    isConnected,
    isLoading,
    connectCalendar,
    disconnectCalendar,
    refreshToken,
    tokenData,
  };
};
