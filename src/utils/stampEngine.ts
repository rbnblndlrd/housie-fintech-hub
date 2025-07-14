// Stamp & Imprint Engine - Core logic for recognizing and awarding stamps
import { supabase } from '@/integrations/supabase/client';
import { createBroadcastEvent, getBroadcastPreferences } from './broadcastEngine';

export interface Stamp {
  id: string;
  name: string;
  category: 'Performance' | 'Loyalty' | 'Crew' | 'Behavior' | 'Reputation';
  canonLevel: 'canon' | 'non_canon';
  flavorText: string;
  icon: string;
  isPublic: boolean;
  tags: string[];
  requirements: StampRequirement[];
  createdAt: string;
  updatedAt: string;
}

export interface StampRequirement {
  type: string;
  value: number;
  unit: string;
  [key: string]: any;
}

export interface UserStamp {
  id: string;
  userId: string;
  stampId: string;
  earnedAt: string;
  contextData: Record<string, any>;
  jobId?: string;
  stamp?: Stamp;
}

export interface StampImprint {
  id: string;
  userId: string;
  userStampId: string;
  narrative: string;
  location?: string;
  contextSummary: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  userStamp?: UserStamp;
}

/**
 * Evaluates stamp eligibility for a completed job
 */
export async function evaluateStampTriggers(userId: string, jobId: string): Promise<{
  eligibleStamps: Array<{
    stampId: string;
    eligible: boolean;
    contextData: Record<string, any>;
  }>;
}> {
  try {
    const { data, error } = await supabase
      .rpc('evaluate_stamp_triggers', {
        p_user_id: userId,
        p_job_id: jobId
      });

    if (error) throw error;

    // Transform database response to match interface
    const eligibleStamps = (data || []).map((item: any) => ({
      stampId: item.stamp_id,
      eligible: item.eligible,
      contextData: item.context_data || {}
    }));

    return { eligibleStamps };
  } catch (error) {
    console.error('Error evaluating stamp triggers:', error);
    return { eligibleStamps: [] };
  }
}

/**
 * Awards a stamp to a user and creates the imprint
 */
export async function awardStamp(
  userId: string,
  stampId: string,
  contextData: Record<string, any> = {},
  jobId?: string
): Promise<{ userStampId?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .rpc('award_stamp', {
        p_user_id: userId,
        p_stamp_id: stampId,
        p_context_data: contextData,
        p_job_id: jobId
      });

    if (error) throw error;

    // Check if this should trigger stamp evolution
    if (data) {
      await evolveStampIfReady(userId, stampId);
      
      // Check for fusion title eligibility after stamp award
      await checkFusionTitleEligibility(userId);
    }

    // Check if this stamp should trigger a broadcast
    await tryCreateStampBroadcast(userId, stampId, contextData);

    return { userStampId: data };
  } catch (error) {
    console.error('Error awarding stamp:', error);
    return { error: error.message };
  }
}

/**
 * Attempts to create a broadcast event for significant stamps
 */
async function tryCreateStampBroadcast(
  userId: string,
  stampId: string,
  contextData: Record<string, any>
) {
  try {
    // Get user's broadcast preferences
    const preferences = await getBroadcastPreferences();
    if (!preferences?.auto_broadcast_achievements) {
      return;
    }

    // Get stamp details
    const { data: stamp } = await supabase
      .from('stamps')
      .select('*')
      .eq('id', stampId)
      .single();

    if (!stamp || !stamp.is_public) return;

    // Determine broadcast scope based on stamp category
    let scope: 'local' | 'city' | 'global' = 'local';
    let eventType: 'stamp' | 'achievement' | 'prestige_milestone' = 'stamp';

    switch (stamp.category) {
      case 'Reputation':
        scope = 'city';
        eventType = 'prestige_milestone';
        break;
      case 'Performance':
        scope = 'local';
        eventType = 'achievement';
        break;
      case 'Crew':
        scope = 'city';
        eventType = 'achievement';
        break;
      default:
        scope = 'local';
        eventType = 'stamp';
    }

    // Create broadcast content with Annette's voice
    const broadcastContent = `${stamp.icon} Stamp earned: ${stamp.name} - ${stamp.flavor_text}`;

    await createBroadcastEvent(
      eventType,
      broadcastContent,
      {
        source: 'stamp_system',
        trust: 'canon',
        generatedBy: 'Annette',
        command: 'stamp_awarded',
        confidence: 0.95,
        dataPoints: [`Stamp: ${stamp.name}`, `Category: ${stamp.category}`]
      },
      scope
    );

  } catch (error) {
    console.error('Error creating stamp broadcast:', error);
  }
}

/**
 * Generates Annette's voice line for a stamp being awarded
 */
export function generateStampVoiceLine(stamp: Stamp, contextData: Record<string, any>): string {
  const baseVoiceLines = {
    'road-warrior': `That job took you ${contextData.distance_km || '35'} km round trip, and you still delivered? Stamp it, sugar. That's a Road Warrior move.`,
    'clockwork': `${contextData.early_arrivals || '10'} early arrivals in a row? Honey, you're more reliable than my morning coffee. Clockwork earned!`,
    'blitzmaster': `${contextData.jobs_today || '5'} jobs in one day? Speed AND quality? That's Blitzmaster territory, and you own it.`,
    'solo-operator': `Flying solo and crushing it? One person army status achieved. Solo Operator stamped!`,
    'five-star-sweep': `${contextData.five_star_count || '10'} five-star reviews? Excellence is your only standard, darling. 5-Star Sweep earned!`,
    'faithful-return': `They called you back again? That's loyalty in action. Faithful Return stamped!`,
    'cleanup-queen': `Perfection in every detail - that's what I see. Cleanup Queen status: earned.`,
    'early-bird': `Up before the sun and ready to work? Early Bird gets the stamp!`,
    'night-shift': `Working while the city sleeps? Night Shift warrior status confirmed.`,
    'storm-rider': `Bad weather? Not your problem. Storm Rider stamped!`
  };

  const voiceLine = baseVoiceLines[stamp.id as keyof typeof baseVoiceLines];
  
  if (voiceLine) {
    return voiceLine;
  }

  // Generic voice line for stamps without specific ones
  return `${stamp.icon} ${stamp.name} earned! ${stamp.flavorText} That's Canon truth, sugar.`;
}

/**
 * Gets all available stamps
 */
export async function getAvailableStamps(): Promise<Stamp[]> {
  try {
    const { data, error } = await supabase
      .from('stamps')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    
    // Transform database response to match interface
    const stamps = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      canonLevel: item.canon_level,
      flavorText: item.flavor_text,
      icon: item.icon,
      isPublic: item.is_public,
      tags: item.tags || [],
      requirements: item.requirements || [],
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    
    return stamps;
  } catch (error) {
    console.error('Error fetching stamps:', error);
    return [];
  }
}

/**
 * Gets user's earned stamps
 */
export async function getUserStamps(userId: string): Promise<UserStamp[]> {
  try {
    const { data, error } = await supabase
      .from('user_stamps')
      .select(`
        *,
        stamp:stamps(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    
    // Transform database response to match interface
    const userStamps = (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      stampId: item.stamp_id,
      earnedAt: item.earned_at,
      contextData: item.context_data || {},
      jobId: item.job_id,
      stamp: item.stamp ? {
        id: item.stamp.id,
        name: item.stamp.name,
        category: item.stamp.category,
        canonLevel: item.stamp.canon_level,
        flavorText: item.stamp.flavor_text,
        icon: item.stamp.icon,
        isPublic: item.stamp.is_public,
        tags: item.stamp.tags || [],
        requirements: item.stamp.requirements || [],
        createdAt: item.stamp.created_at,
        updatedAt: item.stamp.updated_at
      } : undefined
    }));
    
    return userStamps;
  } catch (error) {
    console.error('Error fetching user stamps:', error);
    return [];
  }
}

/**
 * Gets user's stamp imprints
 */
export async function getUserStampImprints(userId: string): Promise<StampImprint[]> {
  try {
    const { data, error } = await supabase
      .from('stamp_imprints')
      .select(`
        *,
        user_stamp:user_stamps(
          *,
          stamp:stamps(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform database response to match interface
    const imprints = (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      userStampId: item.user_stamp_id,
      narrative: item.narrative,
      location: item.location,
      contextSummary: item.context_summary,
      isPinned: item.is_pinned,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      userStamp: item.user_stamp ? {
        id: item.user_stamp.id,
        userId: item.user_stamp.user_id,
        stampId: item.user_stamp.stamp_id,
        earnedAt: item.user_stamp.earned_at,
        contextData: item.user_stamp.context_data || {},
        jobId: item.user_stamp.job_id,
        stamp: item.user_stamp.stamp ? {
          id: item.user_stamp.stamp.id,
          name: item.user_stamp.stamp.name,
          category: item.user_stamp.stamp.category,
          canonLevel: item.user_stamp.stamp.canon_level,
          flavorText: item.user_stamp.stamp.flavor_text,
          icon: item.user_stamp.stamp.icon,
          isPublic: item.user_stamp.stamp.is_public,
          tags: item.user_stamp.stamp.tags || [],
          requirements: item.user_stamp.stamp.requirements || [],
          createdAt: item.user_stamp.stamp.created_at,
          updatedAt: item.user_stamp.stamp.updated_at
        } : undefined
      } : undefined
    }));
    
    return imprints;
  } catch (error) {
    console.error('Error fetching stamp imprints:', error);
    return [];
  }
}

/**
 * Pins or unpins a stamp imprint
 */
export async function toggleImprintPin(imprintId: string, isPinned: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('stamp_imprints')
      .update({ is_pinned: isPinned })
      .eq('id', imprintId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error toggling imprint pin:', error);
    return false;
  }
}

/**
 * Gets stamp statistics for a user
 */
export async function getUserStampStats(userId: string): Promise<{
  totalStamps: number;
  stampsByCategory: Record<string, number>;
  recentStamps: UserStamp[];
}> {
  try {
    const userStamps = await getUserStamps(userId);
    
    const stampsByCategory = userStamps.reduce((acc, userStamp) => {
      const category = userStamp.stamp?.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalStamps: userStamps.length,
      stampsByCategory,
      recentStamps: userStamps.slice(0, 5)
    };
  } catch (error) {
    console.error('Error getting stamp stats:', error);
    return {
      totalStamps: 0,
      stampsByCategory: {},
      recentStamps: []
    };
  }
}

/**
 * Evolve stamp if conditions are met
 */
async function evolveStampIfReady(userId: string, stampId: string) {
  try {
    const { data, error } = await supabase.rpc('evolve_stamp', {
      p_user_id: userId,
      p_stamp_id: stampId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error evolving stamp:', error);
    return null;
  }
}

/**
 * Check and award fusion titles if eligible
 */
async function checkFusionTitleEligibility(userId: string) {
  try {
    // Get all fusion titles
    const { data: fusionTitles, error: titlesError } = await supabase
      .from('fusion_titles')
      .select('id')
      .eq('is_active', true);

    if (titlesError) throw titlesError;

    // Check eligibility for each title
    for (const title of fusionTitles || []) {
      try {
        const { data: eligible, error: checkError } = await supabase
          .rpc('check_fusion_title_eligibility', {
            p_user_id: userId,
            p_title_id: title.id
          });

        if (checkError) continue; // Skip on error

        if (eligible) {
          // Award the fusion title
          await supabase.rpc('award_fusion_title', {
            p_user_id: userId,
            p_title_id: title.id,
            p_context: { auto_awarded: true, timestamp: new Date().toISOString() }
          });
        }
      } catch (err) {
        console.warn(`Error checking fusion title ${title.id}:`, err);
      }
    }
  } catch (error) {
    console.error('Error checking fusion title eligibility:', error);
  }
}

/**
 * Triggers stamp evaluation when a job is completed
 */
export async function processJobCompletionStamps(userId: string, jobId: string) {
  try {
    // Evaluate eligible stamps
    const { eligibleStamps } = await evaluateStampTriggers(userId, jobId);
    
    // Award eligible stamps
    const awardedStamps = [];
    for (const eligibleStamp of eligibleStamps) {
      if (eligibleStamp.eligible) {
        const result = await awardStamp(
          userId,
          eligibleStamp.stampId,
          eligibleStamp.contextData,
          jobId
        );
        
        if (result.userStampId) {
          awardedStamps.push({
            stampId: eligibleStamp.stampId,
            contextData: eligibleStamp.contextData
          });
        }
      }
    }

    console.log('🏆 Stamp evaluation complete:', {
      jobId,
      evaluated: eligibleStamps.length,
      awarded: awardedStamps.length,
      stamps: awardedStamps
    });

    return awardedStamps;
  } catch (error) {
    console.error('Error processing job completion stamps:', error);
    return [];
  }
}