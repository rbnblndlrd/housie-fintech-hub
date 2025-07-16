import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId } = await req.json();
    console.log('Checking vote surge for event:', eventId);

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('canon_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      throw new Error(`Event not found: ${eventError?.message}`);
    }

    // Check for recent vote surge (last 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data: recentVotes, error: votesError } = await supabase
      .from('canon_votes')
      .select('vote_type, weight')
      .eq('event_id', eventId)
      .gte('timestamp', tenMinutesAgo);

    if (votesError) {
      throw new Error(`Failed to fetch votes: ${votesError.message}`);
    }

    // Calculate surge metrics
    const upvotes = recentVotes?.filter(v => v.vote_type === 'upvote').length || 0;
    const totalVotes = recentVotes?.length || 0;
    const voteScore = recentVotes?.reduce((sum, vote) => {
      return sum + (vote.vote_type === 'upvote' ? vote.weight : -vote.weight);
    }, 0) || 0;

    console.log(`Vote surge analysis: ${upvotes} upvotes, ${totalVotes} total votes, score: ${voteScore}`);

    // Detect if this qualifies as a surge (10+ positive votes in 10 minutes)
    if (voteScore >= 10 && upvotes >= 8) {
      console.log('Vote surge detected! Generating Annette commentary...');

      if (!openAIApiKey) {
        console.warn('OpenAI API key not configured, skipping commentary generation');
        return new Response(JSON.stringify({ 
          success: true, 
          surge: true, 
          commentary: null,
          message: 'Vote surge detected but commentary generation skipped (no API key)'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate Annette commentary for the surge
      const prompt = `You are Annette, HOUSIE's sassy AI assistant. A verification event just received a major vote surge (+${voteScore} votes in 10 minutes)!

Event Details:
- Title: "${event.title}"
- Type: ${event.event_type}
- Current Rank: ${event.canon_rank}
- Vote Score: ${event.vote_score || 0}

Generate a short, sassy Annette reaction about this vote surge. She should be impressed by the community response and hint at potential rank escalation. Keep it under 100 characters, confident, and playful.

Examples:
- "Looks like the people have spoken, sugar. That event's goin' regional!"
- "Well well, someone's making waves! Time to escalate this baby."
- "The crowd's going wild for this one. Regional status, here we come!"`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are Annette, HOUSIE\'s overconfident AI assistant. Be sassy, brief, and celebratory about vote surges.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 50,
          temperature: 0.9,
        }),
      });

      const aiData = await response.json();
      const commentary = aiData.choices?.[0]?.message?.content?.trim() || 
        "The people have spoken, sugar! This event's earning its stripes.";

      // Update the event with surge commentary
      const { error: updateError } = await supabase
        .from('canon_events')
        .update({ 
          annette_commentary: commentary,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (updateError) {
        console.error('Failed to update event commentary:', updateError);
      }

      console.log('Vote surge commentary generated:', commentary);

      return new Response(JSON.stringify({ 
        success: true, 
        surge: true, 
        commentary,
        voteScore,
        upvotes,
        totalVotes
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      surge: false, 
      voteScore,
      upvotes,
      totalVotes,
      message: 'No significant vote surge detected'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vote-surge-detection:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});