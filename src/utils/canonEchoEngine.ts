// Canon Echo Engine - Enhanced broadcast system with Canon integration
import { supabase } from '@/integrations/supabase/client';
import { CanonMetadata } from './canonHelper';

export type EchoSource = 'job' | 'stamp' | 'prestige' | 'map' | 'custom';
export type EchoLocation = 'profile' | 'city-board' | 'map' | 'none';
export type EchoVisibility = 'public' | 'private' | 'network-only';
export type EchoReactionType = 'clap' | 'insight' | 'canon_verified' | 'question';

export interface CanonEcho {
  id?: string;
  user_id: string;
  source: EchoSource;
  message: string;
  canonical: boolean;
  location: EchoLocation;
  visibility: EchoVisibility;
  tags: string[];
  
  // Linked data
  job_id?: string;
  stamp_id?: string;
  prestige_title_id?: string;
  
  // Canon metadata
  canon_confidence: number;
  verified_data: boolean;
  generated_by: string;
  command?: string;
  
  // Geographic
  geographic_location?: [number, number]; // [lng, lat]
  city?: string;
  
  // Engagement
  engagement_count?: number;
  reactions_count?: number;
  
  // Status
  is_active?: boolean;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
}

export interface EchoReaction {
  id?: string;
  echo_id: string;
  user_id: string;
  reaction_type: EchoReactionType;
  created_at?: string;
}

export interface BroadcastPreferences {
  public_echo_participation: boolean;
  show_location: boolean;
  auto_broadcast_achievements: boolean;
  broadcast_radius_km: number;
}

/**
 * Creates a Canon Echo from Canon metadata
 */
export async function createCanonEcho(
  message: string,
  canonMetadata: CanonMetadata,
  options: {
    source?: EchoSource;
    location?: EchoLocation;
    visibility?: EchoVisibility;
    tags?: string[];
    job_id?: string;
    stamp_id?: string;
    prestige_title_id?: string;
    geographic_location?: [number, number];
    expires_in_hours?: number;
  } = {}
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check user preferences
    const preferences = await getBroadcastPreferences();
    if (!preferences?.public_echo_participation && options.visibility === 'public') {
      // User has opted out of public participation
      options.visibility = 'private';
    }

    const echoData: any = {
      user_id: user.id,
      source: options.source || 'custom',
      message,
      canonical: canonMetadata.trust === 'canon',
      location: options.location || 'none',
      visibility: options.visibility || 'private',
      tags: options.tags || [],
      
      // Linked data
      job_id: options.job_id,
      stamp_id: options.stamp_id,
      prestige_title_id: options.prestige_title_id,
      
      // Canon metadata
      canon_confidence: canonMetadata.confidence || 0.5,
      verified_data: canonMetadata.trust === 'canon',
      generated_by: canonMetadata.generatedBy || 'system',
      command: canonMetadata.command,
      
      // Geographic
      city: 'Montreal', // TODO: Get from user location
      
      // Expiration
      expires_at: options.expires_in_hours 
        ? new Date(Date.now() + options.expires_in_hours * 60 * 60 * 1000).toISOString()
        : null
    };

    // Add geographic location if allowed
    if (preferences?.show_location && options.geographic_location) {
      const [lng, lat] = options.geographic_location;
      echoData.geographic_location = `POINT(${lng} ${lat})`;
    }

    const { data, error } = await supabase
      .from('canon_echoes')
      .insert(echoData)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating Canon Echo:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error in createCanonEcho:', error);
    return null;
  }
}

/**
 * Gets Canon Echoes with filtering options
 */
export async function getCanonEchoes(
  filters: {
    location?: EchoLocation;
    visibility?: EchoVisibility;
    canonical?: boolean;
    city?: string;
    source?: EchoSource;
    user_id?: string;
    limit?: number;
  } = {}
): Promise<CanonEcho[]> {
  try {
    let query = supabase
      .from('canon_echoes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters.location) {
      query = query.eq('location', filters.location);
    }
    
    if (filters.visibility) {
      query = query.eq('visibility', filters.visibility);
    }
    
    if (filters.canonical !== undefined) {
      query = query.eq('canonical', filters.canonical);
    }
    
    if (filters.city) {
      query = query.eq('city', filters.city);
    }
    
    if (filters.source) {
      query = query.eq('source', filters.source);
    }
    
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching Canon Echoes:', error);
      return [];
    }

    return (data || []) as CanonEcho[];
  } catch (error) {
    console.error('Error in getCanonEchoes:', error);
    return [];
  }
}

/**
 * Gets user's Canon Echoes for the Canon Log
 */
export async function getUserCanonEchoes(
  canonOnly: boolean = false,
  limit: number = 20
): Promise<CanonEcho[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('canon_echoes')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (canonOnly) {
      query = query.eq('canonical', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user Canon Echoes:', error);
      return [];
    }

    return (data || []) as CanonEcho[];
  } catch (error) {
    console.error('Error in getUserCanonEchoes:', error);
    return [];
  }
}

/**
 * Gets broadcast preferences for current user
 */
export async function getBroadcastPreferences(): Promise<BroadcastPreferences | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_broadcast_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching broadcast preferences:', error);
      return null;
    }

    return data ? {
      public_echo_participation: data.public_echo_participation ?? true,
      show_location: data.show_location ?? true,
      auto_broadcast_achievements: data.auto_broadcast_achievements ?? false,
      broadcast_radius_km: (data as any).broadcast_radius_km ?? 10
    } : {
      public_echo_participation: true,
      show_location: true,
      auto_broadcast_achievements: false,
      broadcast_radius_km: 10
    };
  } catch (error) {
    console.error('Error in getBroadcastPreferences:', error);
    return null;
  }
}

/**
 * Updates broadcast preferences
 */
export async function updateBroadcastPreferences(
  preferences: Partial<BroadcastPreferences>
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_broadcast_preferences')
      .upsert({
        user_id: user.id,
        ...preferences
      });

    if (error) {
      console.error('Error updating broadcast preferences:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateBroadcastPreferences:', error);
    return false;
  }
}

/**
 * Adds a reaction to a Canon Echo
 */
export async function addEchoReaction(
  echoId: string,
  reactionType: EchoReactionType
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('canon_echo_reactions')
      .upsert({
        echo_id: echoId,
        user_id: user.id,
        reaction_type: reactionType
      });

    if (error) {
      console.error('Error adding echo reaction:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addEchoReaction:', error);
    return false;
  }
}

/**
 * Generates Annette-style echo transcript
 */
export function generateEchoTranscript(echo: CanonEcho): string {
  const locationMap = {
    'profile': 'Profile',
    'city-board': 'City Board',
    'map': 'Map',
    'none': 'Private'
  };
  
  const canonTag = echo.canonical ? 'Canon ✅' : 'Non-Canon 🌀';
  const location = locationMap[echo.location] || 'Unknown';
  const confidenceBar = '█'.repeat(Math.round(echo.canon_confidence * 5));
  
  return `[Echo ${canonTag} | ${location} | ${confidenceBar}]\n"${echo.message}"`;
}

/**
 * Prompts user for echo broadcast consent
 */
export async function promptEchoBroadcast(
  message: string,
  canonMetadata: CanonMetadata,
  options: {
    source?: EchoSource;
    suggestedLocation?: EchoLocation;
  } = {}
): Promise<{ shouldBroadcast: boolean; echoId?: string }> {
  // Check if user has auto-broadcast enabled
  const preferences = await getBroadcastPreferences();
  
  if (preferences?.auto_broadcast_achievements && canonMetadata.trust === 'canon') {
    // Auto-broadcast Canon achievements
    const echoId = await createCanonEcho(message, canonMetadata, {
      source: options.source || 'custom',
      location: options.suggestedLocation || 'profile',
      visibility: 'public',
      tags: ['auto_broadcast', 'canon_achievement']
    });
    
    return { shouldBroadcast: true, echoId: echoId || undefined };
  }
  
  // For now, return false - in a real implementation, this would show a modal
  return { shouldBroadcast: false };
}

/**
 * Creates an Annette voice line for echo broadcast confirmation
 */
export function getEchoBroadcastVoiceLine(
  location: EchoLocation,
  canonical: boolean
): string {
  const locationVoices = {
    'profile': "📻 Broadcasting this to your profile, sugar. Let them see what you're made of!",
    'city-board': "📡 Putting this on the city board — Montreal's about to know your name!",
    'map': "🗺️ Dropping this pin on the map. Geographic bragging rights, activated!",
    'none': "🤫 Keeping this one between us. Sometimes the best achievements are private."
  };
  
  const baseVoice = locationVoices[location] || "📻 Broadcasting this echo...";
  
  if (canonical) {
    return baseVoice + " Canon verified, baby! ✨";
  }
  
  return baseVoice;
}