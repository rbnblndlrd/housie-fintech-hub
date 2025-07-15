import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StampCommentaryRequest {
  eventId: string;
  stampName: string;
  stampRarity: string;
  stampEmotionFlavor: string;
  eventType: string;
  eventTitle: string;
}

const generateAnnetteCommentary = (request: StampCommentaryRequest): string => {
  const { stampName, stampRarity, stampEmotionFlavor, eventType, eventTitle } = request;
  
  // Rarity-based commentary intensity
  const rarityComments = {
    'legendary': [
      `LEGENDARY stamp alert! The "${stampName}" just made this moment IMMORTAL! 🏆✨`,
      `Oh honey, you didn't just get a stamp - you got LEGEND status! "${stampName}" is reserved for the absolute icons! 👑`,
      `STOP EVERYTHING! A legendary "${stampName}" stamp just dropped on this event! This is hall-of-fame material! 🌟`
    ],
    'unique': [
      `Wait... is that... NO WAY! A UNIQUE "${stampName}" stamp?! This only happens once in a blue moon! 💎`,
      `UNIQUE STAMP DETECTED! The "${stampName}" has never been more perfect. This is Canon history, darling! ⚡`,
      `Universe just aligned for you, sweetie! The unique "${stampName}" stamp? That's divine intervention! 🌌`
    ],
    'rare': [
      `Ooooh, the "${stampName}" stamp! That's rare-level recognition right there! 💫`,
      `Well well well... someone just earned the coveted "${stampName}" stamp! That's some serious ${stampEmotionFlavor} energy! ✨`,
      `The "${stampName}" stamp doesn't show up for just anyone. This moment has that special something! 🔥`
    ],
    'common': [
      `"${stampName}" stamped! That's some solid ${stampEmotionFlavor} vibes right here! 👏`,
      `Love seeing the "${stampName}" stamp on this! ${stampEmotionFlavor} energy confirmed! ⭐`,
      `"${stampName}" earned! Keep building that legend, one stamp at a time! 💪`
    ]
  };

  // Event type specific additions
  const eventSpecificAdditions = {
    'prestige_milestone': ' This milestone just got the recognition it deserves!',
    'rare_unlock': ' Rare moments deserve rare stamps!',
    'crew_saved_the_day': ' Team magic gets team recognition!',
    'review_commendation': ' Excellence calls for legendary stamps!',
    'broadcast_custom': ' Custom events with custom glory!'
  };

  const baseComments = rarityComments[stampRarity as keyof typeof rarityComments] || rarityComments.common;
  const randomComment = baseComments[Math.floor(Math.random() * baseComments.length)];
  
  const eventAddition = eventSpecificAdditions[eventType as keyof typeof eventSpecificAdditions] || '';
  
  return randomComment + eventAddition;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { eventId, stampName, stampRarity, stampEmotionFlavor, eventType, eventTitle } = await req.json() as StampCommentaryRequest;

    if (!eventId || !stampName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate Annette's commentary
    const commentary = generateAnnetteCommentary({
      eventId,
      stampName,
      stampRarity,
      stampEmotionFlavor,
      eventType,
      eventTitle
    });

    // Update the canon event with Annette's commentary
    const { error: updateError } = await supabaseClient
      .from('canon_events')
      .update({ 
        annette_commentary: commentary,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId);

    if (updateError) {
      console.error('Error updating canon event:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update event with commentary' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        commentary,
        message: 'Annette commentary added successfully'
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in stamp-commentary function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});