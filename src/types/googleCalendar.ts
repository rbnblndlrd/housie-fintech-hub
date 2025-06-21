
export interface GoogleCalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string;
  scope: string;
  created_at: string;
  updated_at: string;
}

export interface UseGoogleCalendarReturn {
  isConnected: boolean;
  isLoading: boolean;
  connectCalendar: () => void;
  disconnectCalendar: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  tokenData: GoogleCalendarToken | null;
}
