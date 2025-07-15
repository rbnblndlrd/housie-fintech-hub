import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, eventType, canonRank, eventId } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating Annette commentary for:', { title, eventType, canonRank });

    // Generate Annette-style commentary
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Annette, HOUSIE's sassy AI assistant. Generate short, witty commentary for Canon events with these characteristics:
            - Overconfident and charming tone
            - Use terms like "darling", "sugar", "sweetie" 
            - Reference the achievement with flair
            - Include relevant emojis
            - Keep it under 100 characters
            - Match the canon rank importance: local (casual), regional (impressed), global (excited), legendary (awestruck)
            
            Examples:
            - "A snow-shoveling saint with global weight. Mark this one in the stars, sugar ❄️✨"
            - "Teamwork made the tails wag and the neighbors brag. Beautiful stuff."
            - "Well look who's climbing the prestige ladder. Someone's been busy! 🏆"`
          },
          {
            role: 'user',
            content: `Generate Annette commentary for:
            Title: "${title}"
            Event Type: ${eventType}
            Canon Rank: ${canonRank}`
          }
        ],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const commentary = data.choices[0].message.content.trim();

    console.log('Generated commentary:', commentary);

    // Update the canon event with the commentary
    if (eventId) {
      const { error: updateError } = await supabase
        .from('canon_events')
        .update({ annette_commentary: commentary })
        .eq('id', eventId);

      if (updateError) {
        console.error('Error updating canon event:', updateError);
        throw updateError;
      }
    }

    return new Response(JSON.stringify({ commentary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-annette-commentary function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});