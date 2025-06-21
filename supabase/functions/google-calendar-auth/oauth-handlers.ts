
import { TokenResponse, AuthState } from './types.ts';

export const generateAuthUrl = (userId: string): string => {
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
  authUrl.searchParams.append('state', JSON.stringify({ user_id: userId }));

  return authUrl.toString();
};

export const generateCallbackHtml = (code: string, userId: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Google Calendar Authentication</title>
    </head>
    <body>
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_CALENDAR_AUTH_SUCCESS',
            code: '${code}',
            user_id: '${userId}'
          }, window.location.origin);
          window.close();
        }
      </script>
      <p>Authentication successful! This window will close automatically.</p>
    </body>
    </html>
  `;
};

export const generateErrorHtml = (error: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Google Calendar Authentication Error</title>
    </head>
    <body>
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_CALENDAR_AUTH_ERROR',
            error: '${error}'
          }, window.location.origin);
          window.close();
        }
      </script>
      <p>Authentication failed. This window will close automatically.</p>
    </body>
    </html>
  `;
};

export const exchangeCodeForTokens = async (code: string): Promise<TokenResponse> => {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
      client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: `https://dsfaxqfexebqogdxigdu.supabase.co/functions/v1/google-calendar-auth`,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('Token exchange failed:', errorText);
    throw new Error('Failed to exchange authorization code');
  }

  return await tokenResponse.json();
};

export const refreshAccessToken = async (refreshToken: string): Promise<TokenResponse> => {
  const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
      client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!refreshResponse.ok) {
    throw new Error('Failed to refresh token');
  }

  return await refreshResponse.json();
};
