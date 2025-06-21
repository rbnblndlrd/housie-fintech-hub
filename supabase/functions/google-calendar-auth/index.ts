
import { generateAuthUrl, generateCallbackHtml, generateErrorHtml } from './oauth-handlers.ts';
import { handleTokenExchange, handleTokenRefresh, handleDisconnect, handleInvalidAction, handleMethodNotAllowed } from './request-handlers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    // Handle direct authorization redirect (for popup)
    if (action === 'authorize') {
      const userId = url.searchParams.get('user_id');
      const authUrl = generateAuthUrl(userId!);
      return Response.redirect(authUrl);
    }

    // Handle OAuth callback (when Google redirects back)
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (code && state) {
      const stateData = JSON.parse(state);
      return new Response(generateCallbackHtml(code, stateData.user_id), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (error) {
      return new Response(generateErrorHtml(error), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Handle POST requests for token exchange and other actions
    if (req.method === 'POST') {
      const requestData = await req.json();
      const { action: postAction } = requestData;
      
      switch (postAction) {
        case 'exchange_code':
          return await handleTokenExchange(requestData);
        case 'refresh_token':
          return await handleTokenRefresh(requestData);
        case 'disconnect':
          return await handleDisconnect(requestData);
        default:
          return handleInvalidAction();
      }
    }

    return handleMethodNotAllowed();

  } catch (error) {
    console.error('Google Calendar Auth error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
