
import React, { useEffect } from 'react';

const GoogleCalendarCallback: React.FC = () => {
  useEffect(() => {
    // Get the authorization code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      // Send error message to parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_CALENDAR_AUTH_ERROR',
          error: error
        }, window.location.origin);
      }
      window.close();
      return;
    }

    if (code && state) {
      try {
        const stateData = JSON.parse(state);
        
        // Send success message with code to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_CALENDAR_AUTH_SUCCESS',
            code: code,
            user_id: stateData.user_id
          }, window.location.origin);
        }
        
        window.close();
      } catch (error) {
        console.error('Error parsing state:', error);
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_CALENDAR_AUTH_ERROR',
            error: 'Invalid state parameter'
          }, window.location.origin);
        }
        window.close();
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Connecting your Google Calendar...</p>
      </div>
    </div>
  );
};

export default GoogleCalendarCallback;
