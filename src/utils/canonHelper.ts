// Canon Engine Helper - Determines trust level of insights
import { supabase } from '@/integrations/supabase/client';

export type CanonLevel = 'canon' | 'non_canon';

export interface CanonMetadata {
  source: string;
  trust: CanonLevel;
  generatedBy: string;
  command: string;
  confidence?: number;
  dataPoints?: string[];
  lastVerified?: Date;
}

/**
 * Determines the Canon level of an insight based on source data and type
 */
export function getCanonLevel(insightType: string, sourceData: any): CanonLevel {
  // Canon conditions (verified truth from actual data)
  const canonConditions = [
    // Booking-related data with actual records
    sourceData?.bookings && sourceData.bookings.length > 0,
    // GPS/location-tracked data
    sourceData?.coordinates && sourceData.verified_location,
    // Reviews with verified transactions
    sourceData?.reviews && sourceData.reviews.some((r: any) => r.verified_transaction),
    // Provider profiles with completed jobs
    sourceData?.provider_profile && sourceData.total_bookings > 0,
    // Service connections with actual service history
    sourceData?.service_connections && sourceData.service_connection_count > 0,
    // Direct database queries with real results
    sourceData?.fromDatabase === true,
    // Achievement data with earned stamps
    sourceData?.achievements && sourceData.achievements.filter((a: any) => a.earned).length > 0
  ];

  // If any canon condition is met, it's verified truth
  const isCanon = canonConditions.some(condition => condition);
  
  return isCanon ? 'canon' : 'non_canon';
}

/**
 * Creates Canon metadata for a command action
 */
export function createCanonMetadata(
  command: string, 
  sourceData: any,
  additionalContext?: Partial<CanonMetadata>
): CanonMetadata {
  const trust = getCanonLevel(command, sourceData);
  
  const baseMetadata: CanonMetadata = {
    source: sourceData?.fromDatabase ? 'supabase' : 'ai_analysis',
    trust,
    generatedBy: 'Annette',
    command,
    confidence: trust === 'canon' ? 0.95 : 0.7,
    lastVerified: new Date(),
    ...additionalContext
  };

  // Add specific data points based on command type
  switch (command) {
    case 'top_connections':
      baseMetadata.dataPoints = sourceData?.connections?.map((c: any) => 
        `${c.name} - ${c.booking_count} bookings`
      ) || [];
      break;
    case 'check_prestige':
      baseMetadata.dataPoints = sourceData?.achievements?.map((a: any) => 
        `${a.title} - ${a.earned ? 'Earned' : 'Pending'}`
      ) || [];
      break;
    case 'loyalty_stats':
      baseMetadata.dataPoints = sourceData?.loyalty?.map((l: any) => 
        `${l.client_name} - ${l.frequency} frequency`
      ) || [];
      break;
    default:
      baseMetadata.dataPoints = ['Analysis completed'];
  }

  return baseMetadata;
}

/**
 * Gets Annette's voice style based on Canon level
 */
export function getAnnetteVoiceStyle(canonLevel: CanonLevel): {
  style: string;
  prefix: string;
  confidence: string;
} {
  if (canonLevel === 'canon') {
    return {
      style: 'confident, grounded, playful',
      prefix: '✅ Canonical verified:',
      confidence: 'This is gospel truth, darling.'
    };
  } else {
    return {
      style: 'flirty, hypothetical, cheeky',
      prefix: '🌀 Pending verification:',
      confidence: 'Just my educated guess, sugar.'
    };
  }
}

/**
 * Enhanced voice line with Canon context
 */
export function getCanonEnhancedVoiceLine(
  originalVoiceLine: string,
  canonMetadata: CanonMetadata,
  specificData?: any
): string {
  const voiceStyle = getAnnetteVoiceStyle(canonMetadata.trust);
  
  if (canonMetadata.trust === 'canon') {
    // Canonical-style responses
    const canonEnhancements = {
      top_connections: `Your most reliable client is ${specificData?.topClient || 'someone special'} — that's Canonical, sugar.`,
      check_prestige: `You've officially earned ${specificData?.earnedCount || 'multiple'} achievements — Canonical verified! ✨`,
      loyalty_stats: `${specificData?.loyalClients || 'Your regulars'} come back every ${specificData?.averageFrequency || '2 weeks'} — Canonical truth!`,
      job_radar: `${specificData?.nearbyJobs || 'Fresh opportunities'} in your ${specificData?.radius || '5km'} radius — Canonical confirmed!`
    };
    
    return canonEnhancements[canonMetadata.command as keyof typeof canonEnhancements] || 
           `${voiceStyle.prefix} ${originalVoiceLine}`;
  } else {
    // Pending verification style responses  
    const nonCanonEnhancements = {
      top_connections: `You haven't worked with them yet… but they give me good vibes. Pending verification, but hey — risk it?`,
      check_prestige: `Your potential is through the roof — just gotta make it official! Pending verification, but I believe in you. 🌟`,
      loyalty_stats: `Based on patterns, these folks will probably love you. Pending verification, but my gut's usually right! 😉`,
      job_radar: `These jobs feel like your vibe — pending verification, but pure instinct!`
    };
    
    return nonCanonEnhancements[canonMetadata.command as keyof typeof nonCanonEnhancements] || 
           `${voiceStyle.prefix} ${originalVoiceLine}`;
  }
}

/**
 * Store Canon entry in log (for Canon Log panel)
 */
export async function logCanonEntry(canonMetadata: CanonMetadata, result: string) {
  try {
    // This would store to a canon_logs table in the future
    console.log('📝 Canon Entry Logged:', {
      timestamp: new Date().toISOString(),
      command: canonMetadata.command,
      trust: canonMetadata.trust,
      result,
      metadata: canonMetadata
    });
    
    // Check if this insight is broadcast-worthy
    await tryCreateBroadcastEvent(canonMetadata, result);
    
    // Future: Store in Supabase
    // await supabase.from('canon_logs').insert({
    //   user_id: auth.user?.id,
    //   command: canonMetadata.command,
    //   trust_level: canonMetadata.trust,
    //   result,
    //   metadata: canonMetadata,
    //   created_at: new Date().toISOString()
    // });
    
  } catch (error) {
    console.error('Error logging Canon entry:', error);
  }
}

/**
 * Attempts to create a broadcast event for significant insights
 */
async function tryCreateBroadcastEvent(canonMetadata: CanonMetadata, result: string) {
  try {
    // Only broadcast Canon-level insights with high significance
    if (canonMetadata.trust !== 'canon' || (canonMetadata.confidence || 0) < 0.8) {
      return;
    }

    // Import here to avoid circular dependency
    const { createBroadcastEvent, getBroadcastPreferences } = await import('./broadcastEngine');
    
    // Check if user has auto-broadcast enabled
    const preferences = await getBroadcastPreferences();
    if (!preferences?.auto_broadcast_achievements) {
      return;
    }

    // Determine broadcast type and content based on command
    let eventType: 'title_earned' | 'stamp' | 'booking_streak' | 'achievement' | 'prestige_milestone' | 'service_milestone' = 'achievement';
    let broadcastContent = result;
    let scope: 'local' | 'city' | 'global' = 'local';

    switch (canonMetadata.command) {
      case 'check_prestige':
        eventType = 'prestige_milestone';
        scope = 'city';
        break;
      case 'top_connections':
        eventType = 'service_milestone';
        scope = 'local';
        break;
      case 'loyalty_stats':
        eventType = 'booking_streak';
        scope = 'local';
        break;
      case 'stamp_evaluation':
        eventType = 'stamp';
        scope = 'local';
        break;
      default:
        // Only broadcast certain types of insights
        return;
    }

    // Create the broadcast event
    await createBroadcastEvent(eventType, broadcastContent, canonMetadata, scope);
    
  } catch (error) {
    console.error('Error creating broadcast event:', error);
  }
}

/**
 * Evaluates and awards stamps for a completed job - integrates with Canon system
 */
export async function evaluateJobStamps(userId: string, jobId: string): Promise<string[]> {
  try {
    // Import stamp engine to avoid circular dependency
    const { processJobCompletionStamps, generateStampVoiceLine } = await import('./stampEngine');
    
    // Process stamps for the completed job
    const awardedStamps = await processJobCompletionStamps(userId, jobId);
    
    // Generate Canon entries for each awarded stamp
    const voiceLines: string[] = [];
    for (const awardedStamp of awardedStamps) {
      // Get stamp details for voice line
      const { data: stamp } = await supabase.from('stamps').select('*').eq('id', awardedStamp.stampId).single();
      
      if (stamp) {
        // Transform database stamp to interface format
        const transformedStamp = {
          id: stamp.id,
          name: stamp.name,
          category: stamp.category as 'Performance' | 'Loyalty' | 'Crew' | 'Behavior' | 'Reputation',
          canonLevel: stamp.canon_level as 'canon' | 'non_canon',
          flavorText: stamp.flavor_text,
          icon: stamp.icon,
          isPublic: stamp.is_public,
          tags: stamp.tags || [],
          requirements: (stamp.requirements as any) || [],
          createdAt: stamp.created_at,
          updatedAt: stamp.updated_at
        };
        
        const voiceLine = generateStampVoiceLine(transformedStamp, awardedStamp.contextData);
        voiceLines.push(voiceLine);
        
        // Create Canon metadata for stamp
        const canonMetadata = createCanonMetadata('stamp_evaluation', {
          fromDatabase: true,
          stamp: stamp,
          contextData: awardedStamp.contextData
        });
        
        // Log to Canon system
        await logCanonEntry(canonMetadata, voiceLine);
      }
    }
    
    return voiceLines;
  } catch (error) {
    console.error('Error evaluating job stamps:', error);
    return [];
  }
}

/**
 * Get recent Canon log entries (scaffold for Canon Log panel)
 */
export function getRecentCanonEntries(): Array<{
  id: string;
  timestamp: Date;
  command: string;
  trust: CanonLevel;
  result: string;
  metadata: CanonMetadata;
}> {
  // Future: Fetch from Supabase
  // For now, return mock data that feels realistic
  return [
    {
      id: '1',
      timestamp: new Date(Date.now() - 30000), // 30 seconds ago
      command: 'top_connections',
      trust: 'canon',
      result: 'Your most reliable client is Maria G. from Laval — that\'s Canonical, sugar.',
      metadata: {
        source: 'supabase',
        trust: 'canon',
        generatedBy: 'Annette',
        command: 'top_connections',
        confidence: 0.95,
        dataPoints: ['Maria G. - 8 bookings', 'Luc D. - 5 bookings'],
        lastVerified: new Date()
      }
    },
    {
      id: '2', 
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      command: 'check_prestige',
      trust: 'non_canon',
      result: 'Your potential is through the roof — just gotta make it official! Pending verification, but I believe in you. 🌟',
      metadata: {
        source: 'ai_analysis',
        trust: 'non_canon',
        generatedBy: 'Annette',
        command: 'check_prestige',
        confidence: 0.7,
        dataPoints: ['Winter Services - Pending', 'Quality Master - 80% progress'],
        lastVerified: new Date()
      }
    }
  ];
}