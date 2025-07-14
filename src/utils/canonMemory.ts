// Canon Memory - Track daily Canon chains and streaks
import { supabase } from '@/integrations/supabase/client';

export interface CanonChain {
  dailyCanonCount: number;
  longestStreak: number;
  recentChain: string[];
  todayStamps: string[];
}

export interface CanonMemoryEntry {
  userId: string;
  date: string;
  canonCount: number;
  stampIds: string[];
}

// Track Canon streak for a user
export async function trackCanonStreak(userId: string): Promise<CanonChain> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Get recent stamps (last 7 days)
    const { data: recentStamps, error } = await supabase
      .from('user_stamps')
      .select('stamp_id, canon_status, earned_at')
      .eq('user_id', userId)
      .gte('earned_at', sevenDaysAgo)
      .order('earned_at', { ascending: false });

    if (error) throw error;

    // Get today's Canon stamps
    const todayCanonStamps = recentStamps?.filter(stamp => 
      stamp.canon_status === 'canon' && 
      new Date(stamp.earned_at).toDateString() === new Date().toDateString()
    ) || [];

    // Calculate daily Canon count
    const dailyCanonCount = todayCanonStamps.length;

    // Get all Canon stamps to calculate longest streak
    const { data: allCanonStamps, error: allError } = await supabase
      .from('user_stamps')
      .select('stamp_id, earned_at')
      .eq('user_id', userId)
      .eq('canon_status', 'canon')
      .order('earned_at', { ascending: false });

    if (allError) throw allError;

    // Calculate longest streak
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const stamp of allCanonStamps || []) {
      const stampDate = new Date(stamp.earned_at);
      
      if (!lastDate) {
        currentStreak = 1;
        lastDate = stampDate;
      } else {
        const daysDiff = Math.floor((lastDate.getTime() - stampDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
        
        lastDate = stampDate;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    // Get recent chain (last 5 stamps)
    const recentChain = (recentStamps?.slice(0, 5).map(s => s.stamp_id) || []);
    const todayStamps = todayCanonStamps.map(s => s.stamp_id);

    return {
      dailyCanonCount,
      longestStreak,
      recentChain,
      todayStamps
    };

  } catch (error) {
    console.error('Error tracking Canon streak:', error);
    return {
      dailyCanonCount: 0,
      longestStreak: 0,
      recentChain: [],
      todayStamps: []
    };
  }
}

// Get enhanced voice line based on Canon memory
export function getEnhancedVoiceLine(
  stampId: string, 
  defaultLine: string, 
  canonChain: CanonChain
): string {
  const { dailyCanonCount, longestStreak, recentChain, todayStamps } = canonChain;

  // Check if stamp was earned before
  const isRepeat = recentChain.includes(stampId);
  
  // Meta-responses for high Canon activity
  if (dailyCanonCount >= 3) {
    return `That's your ${dailyCanonCount}th Canon drop today. Stats don't lie, sugar. ${defaultLine}`;
  }

  // Repeat stamp variation
  if (isRepeat) {
    return `Again?! You're a monster. ${defaultLine}`;
  }

  // Streak achievements
  if (longestStreak >= 7) {
    return `Week-long Canon streak says you're built different. ${defaultLine}`;
  }

  // Hot streak
  if (todayStamps.length >= 2) {
    return `You're on fire today! ${defaultLine}`;
  }

  return defaultLine;
}

// Store Canon memory entry
export async function storeCanonMemory(
  userId: string, 
  stampId: string, 
  canonStatus: 'canon' | 'non-canon'
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // This would be implemented to store in a canon_memory table if needed
    // For now, we rely on the user_stamps table
    console.log('Canon memory stored:', { userId, stampId, canonStatus, date: today });
  } catch (error) {
    console.error('Error storing Canon memory:', error);
  }
}