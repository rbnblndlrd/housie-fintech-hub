import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Quick admin function to give credits to the user
    const { email, credits } = await req.json();
    
    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
      
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Give credits to user_credits table
    const { error: creditsError } = await supabase
      .from('user_credits')
      .upsert({
        user_id: user.id,
        total_credits: credits,
        used_credits: 0,
        remaining_credits: credits,
        updated_at: new Date().toISOString()
      });
      
    if (creditsError) {
      console.error('Credits error:', creditsError);
      return new Response(JSON.stringify({ error: creditsError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Also give AI credits
    const { error: aiError } = await supabase
      .from('ai_credits')
      .upsert({
        user_id: user.id,
        balance: credits,
        updated_at: new Date().toISOString()
      });
      
    if (aiError) {
      console.log('AI credits warning (may not exist):', aiError);
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Gave ${credits} credits to ${email}`,
      user_id: user.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});