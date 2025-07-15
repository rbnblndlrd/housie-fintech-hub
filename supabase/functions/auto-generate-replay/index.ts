import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CanonEvent {
  id: string;
  user_id: string;
  event_type: string;
  title: string;
  description?: string;
  canon_rank: string;
  echo_scope: string;
  echo_score: number;
  timestamp: string;
  annette_commentary?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId } = await req.json();

    if (!eventId) {
      return new Response(
        JSON.stringify({ error: 'Event ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the canon event
    const { data: event, error: eventError } = await supabase
      .from('canon_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      console.error('Error fetching event:', eventError);
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    const canonEvent = event as CanonEvent;

    // Generate replay fragments based on event data
    const fragments = await generateReplayFragments(canonEvent);

    // Insert fragments into database
    const { data: insertedFragments, error: insertError } = await supabase
      .from('replay_fragments')
      .insert(fragments)
      .select();

    if (insertError) {
      console.error('Error inserting fragments:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create replay fragments' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log(`Generated ${fragments.length} replay fragments for event ${eventId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        fragmentsCreated: fragments.length,
        fragments: insertedFragments 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in auto-generate-replay:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function generateReplayFragments(event: CanonEvent) {
  const fragments = [];
  let stepOrder = 1;

  // Intro narration based on event type and rank
  const introNarration = generateIntroNarration(event);
  fragments.push({
    event_id: event.id,
    timestamp: event.timestamp,
    type: 'quote',
    content: introNarration,
    step_order: stepOrder++
  });

  // Event-specific content
  if (event.event_type === 'prestige_milestone') {
    fragments.push({
      event_id: event.id,
      timestamp: event.timestamp,
      type: 'stat',
      content: `Achievement unlocked: ${event.title}`,
      step_order: stepOrder++
    });
  }

  if (event.event_type === 'cluster_built') {
    fragments.push({
      event_id: event.id,
      timestamp: event.timestamp,
      type: 'location',
      content: 'Cluster formation complete. Efficiency achieved.',
      step_order: stepOrder++
    });
  }

  if (event.event_type === 'crew_saved_the_day') {
    fragments.push({
      event_id: event.id,
      timestamp: event.timestamp,
      type: 'reaction',
      content: 'Crisis averted. Heroes emerge.',
      step_order: stepOrder++
    });
  }

  // Add Annette's commentary if available
  if (event.annette_commentary) {
    fragments.push({
      event_id: event.id,
      timestamp: event.timestamp,
      type: 'quote',
      content: event.annette_commentary,
      step_order: stepOrder++
    });
  }

  // Canon rank context
  if (event.canon_rank === 'legendary') {
    fragments.push({
      event_id: event.id,
      timestamp: event.timestamp,
      type: 'stat',
      content: `Legendary status achieved. Echo score: ${event.echo_score}`,
      step_order: stepOrder++
    });
  }

  // Outro based on echo scope
  const outroNarration = generateOutroNarration(event);
  if (outroNarration) {
    fragments.push({
      event_id: event.id,
      timestamp: event.timestamp,
      type: 'quote',
      content: outroNarration,
      step_order: stepOrder++
    });
  }

  return fragments;
}

function generateIntroNarration(event: CanonEvent): string {
  const intros = {
    'prestige_milestone': [
      'Another milestone carved into the books...',
      'They said it couldn\'t be done. They were wrong.',
      'The moment when effort meets opportunity.'
    ],
    'cluster_built': [
      'When individual strength becomes collective power...',
      'They were scattered. Now they stand unified.',
      'The art of turning chaos into coordination.'
    ],
    'crew_saved_the_day': [
      'In the crucial moment, heroes emerge...',
      'When the stakes were highest, they delivered.',
      'This is how legends begin.'
    ],
    'broadcast_custom': [
      'A moment worth remembering...',
      'Sometimes the extraordinary hides in plain sight.',
      'Here\'s how it really went down.'
    ],
    'opportunity_formed': [
      'When preparation meets possibility...',
      'The seeds of something greater were planted here.',
      'Opportunities don\'t announce themselves. Until now.'
    ],
    'rare_unlock': [
      'The vault opens for the worthy...',
      'What was locked away now sees the light.',
      'Rarity recognized. Achievement unlocked.'
    ],
    'review_commendation': [
      'Excellence doesn\'t go unnoticed...',
      'When quality speaks, the whole city listens.',
      'This is what five stars really means.'
    ]
  };

  const eventIntros = intros[event.event_type as keyof typeof intros] || intros['broadcast_custom'];
  const selectedIntro = eventIntros[Math.floor(Math.random() * eventIntros.length)];

  // Add rank-specific flavor
  if (event.canon_rank === 'legendary') {
    return selectedIntro + ' A legendary moment unfolds.';
  } else if (event.canon_rank === 'global') {
    return selectedIntro + ' The whole network takes notice.';
  } else if (event.canon_rank === 'regional') {
    return selectedIntro + ' Regional recognition earned.';
  }

  return selectedIntro;
}

function generateOutroNarration(event: CanonEvent): string | null {
  if (event.echo_score >= 50) {
    return 'And that\'s how you make waves across the entire network.';
  } else if (event.echo_score >= 20) {
    return 'The echoes of this moment will be felt for days.';
  } else if (event.canon_rank === 'legendary') {
    return 'Some moments transcend measurement. This was one of them.';
  }

  return null;
}