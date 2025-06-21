
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { TokenResponse } from './types.ts';

const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

export const storeTokens = async (userId: string, tokens: TokenResponse): Promise<void> => {
  const supabase = getSupabaseClient();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  const { error } = await supabase
    .from('google_calendar_tokens')
    .upsert({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt.toISOString(),
      scope: tokens.scope || 'https://www.googleapis.com/auth/calendar',
    });

  if (error) {
    console.error('Database error:', error);
    throw new Error('Failed to store tokens');
  }
};

export const getRefreshToken = async (userId: string): Promise<string> => {
  const supabase = getSupabaseClient();
  
  const { data: tokenData, error } = await supabase
    .from('google_calendar_tokens')
    .select('refresh_token')
    .eq('user_id', userId)
    .single();

  if (error || !tokenData?.refresh_token) {
    throw new Error('No refresh token found');
  }

  return tokenData.refresh_token;
};

export const updateTokens = async (userId: string, tokens: TokenResponse): Promise<void> => {
  const supabase = getSupabaseClient();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  const { error } = await supabase
    .from('google_calendar_tokens')
    .update({
      access_token: tokens.access_token,
      expires_at: expiresAt.toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to update tokens');
  }
};

export const deleteTokens = async (userId: string): Promise<void> => {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('google_calendar_tokens')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to disconnect calendar');
  }
};
