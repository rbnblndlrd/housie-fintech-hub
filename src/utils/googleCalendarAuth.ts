
export class GoogleCalendarAuth {
  static startOAuthFlow(userId: string, onSuccess: () => void, onError: (error: string) => void): void {
    // Create OAuth URL using our Edge Function
    const authUrl = `https://dsfaxqfexebqogdxigdu.supabase.co/functions/v1/google-calendar-auth?action=authorize&user_id=${userId}`;

    // Open popup window for OAuth
    const popup = window.open(
      authUrl,
      'google-calendar-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for popup messages
    const messageListener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_CALENDAR_AUTH_SUCCESS') {
        popup?.close();
        window.removeEventListener('message', messageListener);
        onSuccess();
      }

      if (event.data.type === 'GOOGLE_CALENDAR_AUTH_ERROR') {
        popup?.close();
        window.removeEventListener('message', messageListener);
        onError('Authentication failed');
      }
    };

    window.addEventListener('message', messageListener);
  }
}
