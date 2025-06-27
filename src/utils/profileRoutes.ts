
import { supabase } from '@/integrations/supabase/client';

export const getUsernameFromProfile = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;
    return data.username;
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
};

export const navigateToProfile = async (userId: string): Promise<string> => {
  const username = await getUsernameFromProfile(userId);
  return username ? `/profile/${username}` : '/profile';
};

export const createProfileUrl = (username: string): string => {
  return `/profile/${username}`;
};

export const createProfileEditUrl = (username: string): string => {
  return `/profile/${username}/edit`;
};
