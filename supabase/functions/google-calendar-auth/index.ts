
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle direct authorization redirect (for popup)
    if (action === 'authorize') {
      const userId = url.searchParams.get('user_id');
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

      return Response.redirect(authUrl.toString());
    }

    // Handle OAuth callback (when Google redirects back)
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (code && state) {
      // This is the OAuth callback - send success message to parent window
      const stateData = JSON.parse(state);
      
      return new Response(`
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
                user_id: '${stateData.user_id}'
              }, window.location.origin);
              window.close();
            }
          </script>
          <p>Authentication successful! This window will close automatically.</p>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (error) {
      // OAuth error - send error message to parent window
      return new Response(`
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
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Handle POST requests for token exchange and other actions
    if (req.method === 'POST') {
      const { code: exchangeCode, action: postAction, user_id } = await req.json();
      
      console.log('Google Calendar Auth request:', { action: postAction, user_id: user_id ? 'provided' : 'missing' });

      if (postAction === 'exchange_code') {
        // Exchange authorization code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
            client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
            code: exchangeCode,
            grant_type: 'authorization_code',
            redirect_uri: `https://dsfaxqfexebqogdxigdu.supabase.co/functions/v1/google-calendar-auth`,
          }),
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('Token exchange failed:', errorText);
          throw new Error('Failed to exchange authorization code');
        }

        const tokens: TokenResponse = await tokenResponse.json();
        console.log('Token exchange successful');

        // Calculate expiration time
        const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

        // Store tokens in database
        const { error: dbError } = await supabase
          .from('google_calendar_tokens')
          .upsert({
            user_id: user_id,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: expiresAt.toISOString(),
            scope: tokens.scope || 'https://www.googleapis.com/auth/calendar',
          });

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Failed to store tokens');
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Calendar connected successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (postAction === 'refresh_token') {
        // Get current tokens from database
        const { data: tokenData, error: fetchError } = await supabase
          .from('google_calendar_tokens')
          .select('refresh_token')
          .eq('user_id', user_id)
          .single();

        if (fetchError || !tokenData?.refresh_token) {
          throw new Error('No refresh token found');
        }

        // Refresh the access token
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
            client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
            refresh_token: tokenData.refresh_token,
            grant_type: 'refresh_token',
          }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token');
        }

        const refreshedTokens: TokenResponse = await refreshResponse.json();
        const expiresAt = new Date(Date.now() + refreshedTokens.expires_in * 1000);

        // Update tokens in database
        const { error: updateError } = await supabase
          .from('google_calendar_tokens')
          .update({
            access_token: refreshedTokens.access_token,
            expires_at: expiresAt.toISOString(),
          })
          .eq('user_id', user_id);

        if (updateError) {
          throw new Error('Failed to update tokens');
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            access_token: refreshedTokens.access_token,
            expires_at: expiresAt.toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (postAction === 'disconnect') {
        // Remove tokens from database
        const { error: deleteError } = await supabase
          .from('google_calendar_tokens')
          .delete()
          .eq('user_id', user_id);

        if (deleteError) {
          throw new Error('Failed to disconnect calendar');
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Calendar disconnected successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request method' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Google Calendar Auth error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
