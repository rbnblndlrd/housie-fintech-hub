
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GoogleCalendarService } from '@/services/googleCalendarService';
import { GoogleCalendarAuth } from '@/utils/googleCalendarAuth';
import { GoogleCalendarToken, UseGoogleCalendarReturn } from '@/types/googleCalendar';

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
      const { tokenData: data, isConnected: connected } = await GoogleCalendarService.checkConnection(user.id);
      
      setIsConnected(connected);
      setTokenData(data);
      
      if (data) {
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        
        if (expiresAt <= now) {
          console.log('Token expired, attempting refresh...');
          await refreshToken();
        }
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      setIsConnected(false);
      setTokenData(null);
      // Don't show error toast for missing credentials - it's expected
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

    const handleSuccess = async () => {
      try {
        toast({
          title: "Success!",
          description: "Google Calendar connected successfully.",
        });
        
        await checkConnection();
      } catch (error) {
        console.error('Error after OAuth success:', error);
        toast({
          title: "Connection failed",
          description: "Unable to connect Google Calendar. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleError = (error: string) => {
      console.error('Google Calendar connection error:', error);
      toast({
        title: "Connection failed",
        description: "Unable to connect Google Calendar. Please try again.",
        variant: "destructive",
      });
    };

    try {
      GoogleCalendarAuth.startOAuthFlow(user.id, handleSuccess, handleError);
    } catch (error) {
      console.error('Error starting OAuth flow:', error);
      toast({
        title: "Connection failed",
        description: "Unable to start Google Calendar connection. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast, checkConnection]);

  const disconnectCalendar = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      await GoogleCalendarService.disconnectCalendar(user.id);

      setIsConnected(false);
      setTokenData(null);
      
      toast({
        title: "Disconnected",
        description: "Google Calendar has been disconnected.",
      });
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast({
        title: "Error",
        description: "Unable to disconnect Google Calendar.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (!user || !tokenData) return null;

    try {
      const newAccessToken = await GoogleCalendarService.refreshAccessToken(user.id);
      
      if (newAccessToken) {
        // Update local state
        await checkConnection();
        return newAccessToken;
      } else {
        // If refresh fails, disconnect the calendar
        setIsConnected(false);
        setTokenData(null);
        return null;
      }
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
