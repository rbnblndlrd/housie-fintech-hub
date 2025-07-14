// Canon Stamp Scanner™ - Dynamic recognition system for job events
import { supabase } from '@/integrations/supabase/client';
import { awardStamp, generateStampVoiceLine, type Stamp } from './stampEngine';
import { getCanonContext, type UserContext } from './contextAwareEngine';
import { logAnnetteCanonInsight } from './annetteCanonLog';
import { trackCanonStreak, getEnhancedVoiceLine } from './canonMemory';

// Forward declaration to avoid circular dependency
export interface StampDefinition {
  id: string;
  title: string;
  description: string;
  canonical: boolean;
  triggerCondition: (job: JobData, user: UserContext) => Promise<boolean> | boolean;
  icon: string;
  voiceLine: (user: UserContext, contextData?: Record<string, any>) => string;
  category: 'Performance' | 'Loyalty' | 'Crew' | 'Behavior' | 'Reputation';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  tags: string[];
}

export interface ScanResult {
  eligibleStamps: StampDefinition[];
  awardedStamps: StampAward[];
  annetteResponse?: string;
  canonStatus: 'canon' | 'non_canon';
}

export interface StampAward {
  stampId: string;
  contextData: Record<string, any>;
  voiceLine: string;
  canonLevel: 'canon' | 'non_canon';
}

export interface JobData {
  id: string;
  userId: string;
  serviceType: string;
  completedAt: Date;
  distanceKm?: number;
  duration?: number;
  rating?: number;
  isTeamJob?: boolean;
  priority?: 'normal' | 'high';
  location?: string;
  clientId?: string;
  totalAmount?: number;
}

/**
 * Main Canon Stamp Scanner™ function - scans completed jobs for stamp eligibility
 */
export async function scanJobForStamps(userId: string, jobId?: string): Promise<ScanResult> {
  try {
    console.log('🔍 Canon Stamp Scanner™ initiated for user:', userId);
    
    // Get user context for Canon validation
    const context = await getCanonContext(userId);
    
    // Get job data (mock for now, later will fetch real job)
    const jobData = jobId ? await fetchJobData(jobId) : generateMockJobData(userId, context);
    
    if (!jobData) {
      return {
        eligibleStamps: [],
        awardedStamps: [],
        canonStatus: 'non_canon'
      };
    }

    // Get stamp definitions (lazy load to avoid circular import)
    const { STAMP_DEFINITIONS } = await import('./stampDefinitions');
    
    // Evaluate all stamp conditions
    const eligibleStamps = await evaluateStampConditions(jobData, context, STAMP_DEFINITIONS);
    console.log('📋 Eligible stamps found:', eligibleStamps.length);

    // Award eligible stamps
    const awardedStamps: StampAward[] = [];
    for (const stampDef of eligibleStamps) {
      const award = await awardStampWithVoiceLine(userId, stampDef, jobData, context);
      if (award) {
        awardedStamps.push(award);
      }
    }

    // Generate enhanced Annette response with Canon memory
    const canonChain = await trackCanonStreak(userId);
    const baseResponse = generateAnnetteStampResponse(awardedStamps, context);
    const annetteResponse = baseResponse ? getEnhancedVoiceLine('stamp_scan', baseResponse, canonChain) : undefined;
    
    // Log Canon insight
    await logAnnetteCanonInsight({
      userId,
      clipId: 'stamp_scanner',
      canonStatus: awardedStamps.length > 0 ? 'canon' : 'non_canon',
      triggeredContext: context,
      voiceLine: annetteResponse || 'Stamp scan complete',
      contextTags: ['stamp_scan', 'job_completion']
    });

    return {
      eligibleStamps,
      awardedStamps,
      annetteResponse,
      canonStatus: awardedStamps.length > 0 ? 'canon' : 'non_canon'
    };
  } catch (error) {
    console.error('❌ Canon Stamp Scanner error:', error);
    return {
      eligibleStamps: [],
      awardedStamps: [],
      canonStatus: 'non_canon'
    };
  }
}

/**
 * Evaluates all stamp conditions against job data
 */
async function evaluateStampConditions(jobData: JobData, context: UserContext, stampDefinitions: StampDefinition[]): Promise<StampDefinition[]> {
  const eligibleStamps: StampDefinition[] = [];

  for (const stampDef of stampDefinitions) {
    try {
      const isEligible = await stampDef.triggerCondition(jobData, context);
      if (isEligible) {
        eligibleStamps.push(stampDef);
        console.log(`✅ Stamp eligible: ${stampDef.title} (${stampDef.canonical ? 'Canon' : 'Non-Canon'})`);
      }
    } catch (error) {
      console.error(`❌ Error evaluating stamp ${stampDef.id}:`, error);
    }
  }

  return eligibleStamps;
}

/**
 * Awards a stamp and generates context-aware voice line
 */
async function awardStampWithVoiceLine(
  userId: string,
  stampDef: StampDefinition,
  jobData: JobData,
  context: UserContext
): Promise<StampAward | null> {
  try {
    // Prepare context data for stamp
    const contextData = {
      jobId: jobData.id,
      completedAt: jobData.completedAt.toISOString(),
      serviceType: jobData.serviceType,
      distanceKm: jobData.distanceKm,
      duration: jobData.duration,
      rating: jobData.rating,
      location: jobData.location,
      prestigeRank: context.prestigeRank,
      equippedTitle: context.equippedTitle?.name
    };

    // Award the stamp using existing system
    const result = await awardStamp(userId, stampDef.id, contextData, jobData.id);
    
    if (result.error) {
      console.error(`❌ Failed to award stamp ${stampDef.id}:`, result.error);
      return null;
    }

    // Generate enhanced voice line with equipped stamp flavor
    let voiceLine = stampDef.voiceLine(context, contextData);
    
    // Add equipped stamp flavor to voice lines
    const hasRoadWarrior = context.equippedStamps.some(s => s.stampId === 'road-warrior');
    const hasOneWomanArmy = context.equippedStamps.some(s => s.stampId === 'one-woman-army');
    const hasCrewCommander = context.equippedStamps.some(s => s.stampId === 'crew-commander');
    
    if (hasRoadWarrior && stampDef.id !== 'road-warrior') {
      voiceLine += " With Road Warrior pinned to your chest, sugar, I trust you're ready to roam even further!";
    } else if (hasOneWomanArmy && stampDef.id !== 'one-woman-army') {
      voiceLine += " That One-Woman Army medal suits you perfectly — solo strength personified!";
    } else if (hasCrewCommander && stampDef.id !== 'crew-commander') {
      voiceLine += " Commander energy confirmed with that medal display! Leadership is your superpower!";
    }
    
    // Add special flair for users with multiple equipped stamps
    if (context.equippedStamps.length >= 3) {
      voiceLine += " 🏅 Equipped Medalist — that one's going next to your others, baby. Frame-worthy!";
    }

    return {
      stampId: stampDef.id,
      contextData,
      voiceLine,
      canonLevel: stampDef.canonical ? 'canon' : 'non_canon'
    };
  } catch (error) {
    console.error(`❌ Error awarding stamp ${stampDef.id}:`, error);
    return null;
  }
}

/**
 * Generates Annette's response for awarded stamps
 */
function generateAnnetteStampResponse(awards: StampAward[], context: UserContext): string | undefined {
  if (awards.length === 0) {
    return undefined;
  }

  if (awards.length === 1) {
    const award = awards[0];
    return award.voiceLine;
  }

  // Multiple stamps awarded
  const canonCount = awards.filter(a => a.canonLevel === 'canon').length;
  const totalCount = awards.length;
  
  if (canonCount === totalCount) {
    return `🔥 STAMP BONANZA! ${totalCount} stamps earned in one go — every single one Canon verified! You're absolutely crushing it, sugar!`;
  } else if (canonCount > 0) {
    return `✨ Multi-stamp achievement! ${totalCount} stamps earned (${canonCount} Canon verified). That's the kind of performance I love to see!`;
  } else {
    return `💫 Look at you collecting stamps like Pokemon! ${totalCount} achievements earned. Keep that momentum flowing!`;
  }
}

/**
 * Fetches real job data from database
 */
async function fetchJobData(jobId: string): Promise<JobData | null> {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !booking) {
      console.error('Failed to fetch job data:', error);
      return null;
    }

    // Transform booking data to JobData format
    return {
      id: booking.id,
      userId: booking.customer_id,
      serviceType: booking.category || 'General',
      completedAt: new Date(booking.completed_at || booking.updated_at),
      distanceKm: Math.floor(Math.random() * 50) + 5, // Mock distance for now
      duration: booking.duration_hours ? booking.duration_hours * 60 : undefined,
      rating: 5, // Mock rating
      isTeamJob: false, // Mock team job status
      priority: booking.priority as 'normal' | 'high' || 'normal',
      location: booking.service_address || 'Montreal',
      clientId: booking.customer_id,
      totalAmount: booking.total_amount
    };
  } catch (error) {
    console.error('Error fetching job data:', error);
    return null;
  }
}

/**
 * Generates mock job data for testing
 */
function generateMockJobData(userId: string, context: UserContext): JobData {
  const serviceTypes = ['Cleaning', 'Appliance Repair', 'Move-in', 'Pet Care', 'Maintenance'];
  const mockDistances = [5, 15, 25, 35, 45]; // km
  const mockRatings = [3, 4, 4, 5, 5]; // weighted toward higher ratings
  
  return {
    id: `mock-job-${Date.now()}`,
    userId,
    serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
    completedAt: new Date(),
    distanceKm: mockDistances[Math.floor(Math.random() * mockDistances.length)],
    duration: Math.floor(Math.random() * 180) + 30, // 30-210 minutes
    rating: mockRatings[Math.floor(Math.random() * mockRatings.length)],
    isTeamJob: Math.random() > 0.7, // 30% chance of team job
    priority: Math.random() > 0.8 ? 'high' : 'normal', // 20% chance of high priority
    location: context.currentLocation || 'Montreal',
    clientId: `mock-client-${Math.floor(Math.random() * 1000)}`,
    totalAmount: Math.floor(Math.random() * 200) + 50 // $50-$250
  };
}

/**
 * Processes job completion and triggers stamp scanning
 */
export async function processJobCompletionStamps(userId: string, jobId: string): Promise<ScanResult> {
  console.log('🎯 Processing job completion stamps for job:', jobId);
  return await scanJobForStamps(userId, jobId);
}

/**
 * Manual stamp scan trigger (for testing or manual scans)
 */
export async function triggerManualStampScan(userId: string): Promise<ScanResult> {
  console.log('🔧 Manual stamp scan triggered for user:', userId);
  return await scanJobForStamps(userId);
}