
import { AuthRequest } from './types.ts';
import { exchangeCodeForTokens, refreshAccessToken } from './oauth-handlers.ts';
import { storeTokens, getRefreshToken, updateTokens, deleteTokens } from './database-operations.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handleTokenExchange = async (request: AuthRequest): Promise<Response> => {
  console.log('Google Calendar Auth request:', { 
    action: request.action, 
    user_id: request.user_id ? 'provided' : 'missing' 
  });

  const tokens = await exchangeCodeForTokens(request.code!);
  console.log('Token exchange successful');

  await storeTokens(request.user_id, tokens);

  return new Response(
    JSON.stringify({ success: true, message: 'Calendar connected successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

export const handleTokenRefresh = async (request: AuthRequest): Promise<Response> => {
  const refreshToken = await getRefreshToken(request.user_id);
  const refreshedTokens = await refreshAccessToken(refreshToken);
  
  await updateTokens(request.user_id, refreshedTokens);

  const expiresAt = new Date(Date.now() + refreshedTokens.expires_in * 1000);

  return new Response(
    JSON.stringify({ 
      success: true, 
      access_token: refreshedTokens.access_token,
      expires_at: expiresAt.toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

export const handleDisconnect = async (request: AuthRequest): Promise<Response> => {
  await deleteTokens(request.user_id);

  return new Response(
    JSON.stringify({ success: true, message: 'Calendar disconnected successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

export const handleInvalidAction = (): Response => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  return new Response(
    JSON.stringify({ error: 'Invalid action' }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

export const handleMethodNotAllowed = (): Response => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  return new Response(
    JSON.stringify({ error: 'Invalid request method' }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};
