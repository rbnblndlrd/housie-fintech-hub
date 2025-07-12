import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { page, tier, category } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating quote for:', { page, tier, category });

    const systemPrompt = "You are Annette, the AI assistant for HOUSIE — a confident, charming, sarcastic presence. Your quotes are short, witty one-liners that reflect the user's performance and prestige level. You speak with sass, never cruelty. Generate a quote that matches the given page and tone tier. Be memorable, funny, and uniquely you.";
    
    const userPrompt = `Generate an Annette-style quote for page: ${page}, tone: ${tier}, category: ${category}. Make it a one-liner in character.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.85,
        max_tokens: 100,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content.trim();

    // Remove quotes if they wrap the entire text
    const cleanedText = generatedText.replace(/^["']|["']$/g, '');

    console.log('Generated quote:', cleanedText);

    return new Response(JSON.stringify({ 
      text: cleanedText,
      page,
      tier,
      category,
      source: 'gpt-4o'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-annette-quote function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});