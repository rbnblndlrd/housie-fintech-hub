// Context-Aware Revollver™ Intelligence Engine
import { supabase } from '@/integrations/supabase/client';
import { type CanonMetadata, createCanonMetadata, getCanonEnhancedVoiceLine } from './canonHelper';
import { type ClipDefinition, type ContextVariant, getClipDefinition } from '@/types/clipDefinitions';
import { logAnnetteCanonInsight } from './annetteCanonLog';

export interface UserContext {
  // Booking Activity
  totalBookingsToday: number;
  upcomingSlots: BookingSlot[];
  
  // Title & Prestige
  equippedTitle?: PrestigeTitle;
  prestigeRank: number;
  
  // Equipped Stamps (Medal Display)
  equippedStamps: EquippedStamp[];
  
  // User Mode
  userMode: 'provider' | 'crew_leader' | 'customer' | 'coordinator';
  
  // Job Context
  lastJobType?: string;
  recentJobTypes: string[];
  
  // Location & Activity
  currentLocation?: string;
  activeRadius: number;
}

export interface EquippedStamp {
  stampId: string;
  position: number;
  equippedAt: string;
}

export interface BookingSlot {
  id: string;
  scheduledTime: Date;
  serviceType: string;
  clientName: string;
  withinOneHour: boolean;
}

export interface PrestigeTitle {
  id: string;
  name: string;
  icon: string;
  category: string;
  tier: number;
}

export interface ContextAwareResponse {
  voiceLine: string;
  canonMetadata: CanonMetadata;
  contextTags: string[];
  flavorType: 'canon' | 'non_canon';
}

/**
 * Gets comprehensive user context for smart Revollver responses
 */
export async function getCanonContext(userId?: string): Promise<UserContext> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      return getDefaultContext();
    }

    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

    // Fetch today's bookings
    const { data: todayBookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', userId)
      .gte('created_at', todayStart.toISOString())
      .order('scheduled_date', { ascending: true });

    // Fetch upcoming bookings (within 1 hour)
    const { data: upcomingBookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', userId)
      .gte('scheduled_date', new Date().toISOString())
      .lte('scheduled_date', oneHourFromNow.toISOString())
      .order('scheduled_date', { ascending: true });

    // Get equipped prestige title
    const { data: equippedTitleData } = await supabase
      .from('prestige_progress')
      .select(`
        title_id,
        prestige_titles (
          id, name, icon, category, tier
        )
      `)
      .eq('user_id', userId)
      .eq('equipped', true)
      .eq('completed_at', null)
      .single();

    // Get user's primary role
    const { data: roleData } = await supabase
      .from('user_role_preferences')
      .select('primary_role')
      .eq('user_id', userId)
      .single();

    // Get recent job types (last 10 bookings)
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select('category')
      .eq('customer_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(10);

    // Get equipped stamps
    const { data: equippedStampsData } = await supabase
      .rpc('get_user_equipped_stamps', { p_user_id: userId });

    // Calculate prestige rank (simplified)
    const { data: prestigeProgress } = await supabase
      .from('prestige_progress')
      .select('completed_at')
      .eq('user_id', userId)
      .not('completed_at', 'is', null);

    const upcomingSlots: BookingSlot[] = upcomingBookings?.map(booking => ({
      id: booking.id,
      scheduledTime: new Date(booking.scheduled_date + ' ' + booking.scheduled_time),
      serviceType: booking.category || 'General',
      clientName: booking.custom_title || 'Client',
      withinOneHour: true
    })) || [];

    const equippedTitle = equippedTitleData?.prestige_titles ? {
      id: equippedTitleData.prestige_titles.id,
      name: equippedTitleData.prestige_titles.name,
      icon: equippedTitleData.prestige_titles.icon,
      category: equippedTitleData.prestige_titles.category,
      tier: equippedTitleData.prestige_titles.tier
    } : undefined;

    const equippedStamps: EquippedStamp[] = equippedStampsData?.map((stamp: any) => ({
      stampId: stamp.stamp_id,
      position: stamp.display_position,
      equippedAt: stamp.equipped_at
    })) || [];

    return {
      totalBookingsToday: todayBookings?.length || 0,
      upcomingSlots,
      equippedTitle,
      equippedStamps,
      prestigeRank: prestigeProgress?.length || 0,
      userMode: (roleData?.primary_role as any) || 'customer',
      lastJobType: recentBookings?.[0]?.category,
      recentJobTypes: recentBookings?.map(b => b.category).filter(Boolean) || [],
      currentLocation: 'Montreal', // Default for now
      activeRadius: 5000 // 5km default
    };
  } catch (error) {
    console.error('Error fetching Canon context:', error);
    return getDefaultContext();
  }
}

/**
 * Default context for when data isn't available
 */
function getDefaultContext(): UserContext {
  return {
    totalBookingsToday: 0,
    upcomingSlots: [],
    equippedStamps: [],
    prestigeRank: 0,
    userMode: 'customer',
    recentJobTypes: [],
    currentLocation: 'Montreal',
    activeRadius: 5000
  };
}

/**
 * Enhanced context-aware response generation using structured clip definitions
 */
export async function generateContextAwareResponse(
  command: string,
  originalVoiceLine: string,
  context: UserContext,
  clipId?: string
): Promise<ContextAwareResponse> {
  const contextTags = buildContextTags(context);
  
  // Try to use enhanced clip definition if available
  let voiceLine = originalVoiceLine;
  let canonStatus: 'canon' | 'non_canon' = 'non_canon';
  
  if (clipId) {
    const clipDefinition = getClipDefinition(clipId);
    if (clipDefinition) {
      const matchedVariant = findBestContextMatch(clipDefinition.contextVariants, context);
      if (matchedVariant) {
        voiceLine = matchedVariant.line;
        canonStatus = matchedVariant.canonStatus || 'non_canon';
      } else {
        voiceLine = clipDefinition.defaultLine;
      }
    }
  }
  
  const sourceData = {
    fromDatabase: canonStatus === 'canon',
    verified_data: canonStatus === 'canon',
    context
  };
  
  const canonMetadata = createCanonMetadata(command, sourceData);
  canonMetadata.trust = canonStatus; // Override with context-determined status
  
  // Log the Canon insight
  if (clipId) {
    await logAnnetteCanonInsight({
      userId: '', // Will be filled by the logging function
      clipId,
      canonStatus,
      triggeredContext: context,
      voiceLine,
      contextTags
    });
  }
  
  return {
    voiceLine,
    canonMetadata,
    contextTags,
    flavorType: canonStatus
  };
}

/**
 * Legacy context-aware response generation (for backward compatibility)
 */
export function generateContextAwareResponseSync(
  command: string,
  originalVoiceLine: string,
  context: UserContext
): ContextAwareResponse {
  const contextTags = buildContextTags(context);
  const sourceData = {
    fromDatabase: true,
    verified_data: true,
    context
  };
  
  const canonMetadata = createCanonMetadata(command, sourceData);
  
  // Generate context-aware voice line
  const voiceLine = generateSmartVoiceLine(command, originalVoiceLine, context, canonMetadata);
  
  return {
    voiceLine,
    canonMetadata,
    contextTags,
    flavorType: canonMetadata.trust
  };
}

/**
 * Builds context tags for categorization
 */
function buildContextTags(context: UserContext): string[] {
  const tags: string[] = [];
  
  // Booking activity tags
  if (context.totalBookingsToday > 0) {
    tags.push('active_today');
  }
  if (context.upcomingSlots.length > 0) {
    tags.push('upcoming_jobs');
  }
  
  // Title tags
  if (context.equippedTitle) {
    tags.push(`title_${context.equippedTitle.name.toLowerCase().replace(/\s+/g, '_')}`);
    tags.push(`tier_${context.equippedTitle.tier}`);
  }
  
  // Prestige rank tags
  if (context.prestigeRank === 0) {
    tags.push('newcomer');
  } else if (context.prestigeRank < 4) {
    tags.push('learning');
  } else {
    tags.push('experienced');
  }
  
  // Role tags
  tags.push(`role_${context.userMode}`);
  
  // Job type tags
  if (context.lastJobType) {
    tags.push(`recent_${context.lastJobType.toLowerCase()}`);
  }
  
  return tags;
}

/**
 * Generates smart, context-aware voice lines
 */
function generateSmartVoiceLine(
  command: string,
  originalVoiceLine: string,
  context: UserContext,
  canonMetadata: CanonMetadata
): string {
  // Context-aware response patterns
  const responses = getContextResponses(command, context, canonMetadata.trust);
  
  if (responses.length > 0) {
    // Pick response based on context priority
    return responses[0];
  }
  
  // Fallback to enhanced original
  return getCanonEnhancedVoiceLine(originalVoiceLine, canonMetadata, {
    upcomingJobs: context.upcomingSlots.length,
    totalToday: context.totalBookingsToday,
    equippedTitle: context.equippedTitle?.name,
    prestigeRank: context.prestigeRank
  });
}

/**
 * Context-specific response patterns
 */
function getContextResponses(command: string, context: UserContext, canonLevel: 'canon' | 'non_canon'): string[] {
  const responses: string[] = [];
  
  // Time-sensitive responses
  if (context.upcomingSlots.length > 0) {
    const nextSlot = context.upcomingSlots[0];
    const minutesUntil = Math.floor((nextSlot.scheduledTime.getTime() - Date.now()) / (1000 * 60));
    
    if (command === 'optimize_route' && minutesUntil < 60) {
      responses.push(`${minutesUntil} minutes 'til game time — let's optimize this route, sugar! ⏰`);
    }
    
    if (command === 'check_prestige' && minutesUntil < 30) {
      responses.push(`T-minus ${minutesUntil} minutes! Quick prestige check before you roll out! ✨`);
    }
  }
  
  // Title-specific responses
  if (context.equippedTitle) {
    const titleResponses = getTitleSpecificResponse(command, context.equippedTitle, canonLevel);
    if (titleResponses) responses.push(titleResponses);
  }
  
  // Prestige tier responses
  const tierResponse = getTierSpecificResponse(command, context.prestigeRank, canonLevel);
  if (tierResponse) responses.push(tierResponse);
  
  // Job type specific responses
  if (context.lastJobType) {
    const jobResponse = getJobTypeResponse(command, context.lastJobType, canonLevel);
    if (jobResponse) responses.push(jobResponse);
  }
  
  // Activity level responses
  if (context.totalBookingsToday >= 3) {
    if (command === 'check_prestige') {
      responses.push(canonLevel === 'canon' 
        ? `Three jobs today?! You're absolutely crushing it — Canon verified! 🔥`
        : `Three jobs today? Someone's hungry for success! Keep that energy flowing! 💪`
      );
    }
  }
  
  return responses;
}

/**
 * Title-specific response flavor
 */
function getTitleSpecificResponse(command: string, title: PrestigeTitle, canonLevel: 'canon' | 'non_canon'): string | null {
  const titleName = title.name.toLowerCase();
  
  if (titleName.includes('commander') && titleName.includes('clean')) {
    if (command === 'optimize_route') {
      return canonLevel === 'canon'
        ? `Commander of Clean reporting for duty! Route optimization with military precision! 🧹⚡`
        : `Commander vibes detected! Let's strategize this route like the pro you are! 🎯`;
    }
  }
  
  if (titleName.includes('road') && titleName.includes('warrior')) {
    if (command === 'optimize_route') {
      return canonLevel === 'canon'
        ? `Road Warrior mode activated! Your tires might be tired... but not you. Let's optimize! 🛣️`
        : `Road Warrior energy detected! Time to conquer those routes with style! 🚗💨`;
    }
  }
  
  return null;
}

/**
 * Tier-specific response adjustments
 */
function getTierSpecificResponse(command: string, prestigeRank: number, canonLevel: 'canon' | 'non_canon'): string | null {
  if (prestigeRank <= 3) {
    // Onboarding help for newcomers
    if (command === 'check_prestige') {
      return canonLevel === 'canon'
        ? `Let's check your progress, rookie! Everyone starts somewhere — and you're doing great! 🌱`
        : `New player energy! Let's see what achievements are within reach! 🎮`;
    }
  } else if (prestigeRank >= 4) {
    // Sassier responses for experienced users
    if (command === 'check_prestige') {
      return canonLevel === 'canon'
        ? `Look who's back for more glory! Your prestige speaks for itself, darling. ✨`
        : `Veteran spotted! Your reputation precedes you, sugar. What's the next conquest? 👑`;
    }
  }
  
  return null;
}

/**
 * Job type specific flavor
 */
function getJobTypeResponse(command: string, jobType: string, canonLevel: 'canon' | 'non_canon'): string | null {
  const lowerJobType = jobType.toLowerCase();
  
  if (lowerJobType.includes('pet') && command === 'job_radar') {
    return canonLevel === 'canon'
      ? `I sniff potential in your area! Pet care jobs detected — Canon confirmed! 🐕`
      : `Pet vibes incoming! These furry opportunities feel perfect for you! 🐾`;
  }
  
  if (lowerJobType.includes('clean') && command === 'optimize_route') {
    return canonLevel === 'canon'
      ? `Cleaning specialist detected! Route optimized for maximum sparkle efficiency! ✨🧽`
      : `Cleaning pro energy! Let's map out the most efficient sparkle trail! 🌟`;
  }
  
  return null;
}

/**
 * Finds the best matching context variant for a clip
 */
function findBestContextMatch(variants: ContextVariant[], context: UserContext): ContextVariant | null {
  if (!variants.length) return null;
  
  let bestMatch: ContextVariant | null = null;
  let bestScore = 0;
  
  for (const variant of variants) {
    let score = 0;
    let totalChecks = 0;
    
    // Check prestige tier match
    if (variant.match.prestigeTier !== undefined) {
      totalChecks++;
      if (variant.match.prestigeTier === context.prestigeRank) {
        score += 2; // High weight for exact prestige match
      } else if (Math.abs(variant.match.prestigeTier - context.prestigeRank) <= 1) {
        score += 1; // Partial match for nearby tiers
      }
    }
    
    // Check user mode match
    if (variant.match.userMode) {
      totalChecks++;
      if (variant.match.userMode === context.userMode) {
        score += 2;
      }
    }
    
    // Check equipped title match
    if (variant.match.equippedTitle) {
      totalChecks++;
      if (context.equippedTitle?.name.toLowerCase().includes(variant.match.equippedTitle.toLowerCase())) {
        score += 3; // Very high weight for title match
      }
    }
    
    // Check upcoming jobs
    if (variant.match.upcomingJobsToday !== undefined) {
      totalChecks++;
      if (variant.match.upcomingJobsToday === context.upcomingSlots.length) {
        score += 2;
      }
    }
    
    // Check total bookings today
    if (variant.match.totalBookingsToday !== undefined) {
      totalChecks++;
      if (variant.match.totalBookingsToday <= context.totalBookingsToday) {
        score += 1;
      }
    }
    
    // Check last job type
    if (variant.match.lastJobType) {
      totalChecks++;
      if (context.lastJobType?.toLowerCase().includes(variant.match.lastJobType.toLowerCase())) {
        score += 2;
      }
    }
    
    // Calculate match percentage
    const matchPercentage = totalChecks > 0 ? score / (totalChecks * 2) : 0;
    
    // Update best match if this is better (require at least 50% match)
    if (matchPercentage >= 0.5 && score > bestScore) {
      bestMatch = variant;
      bestScore = score;
    }
  }
  
  return bestMatch;
}

/**
 * Apply context tags to clip metadata
 */
export function enhanceClipWithContext(clip: any, context: UserContext): any {
  const contextTags = buildContextTags(context);
  
  return {
    ...clip,
    contextTags,
    contextMetadata: {
      upcomingSlots: context.upcomingSlots.length,
      totalBookingsToday: context.totalBookingsToday,
      equippedTitle: context.equippedTitle?.name,
      prestigeRank: context.prestigeRank,
      userMode: context.userMode
    }
  };
}