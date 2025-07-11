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

interface JobParseRequest {
  jobId: string;
  jobData: {
    service_type: string;
    customer_name: string;
    address: string;
    instructions?: string;
    priority: string;
    status: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, jobData }: JobParseRequest = await req.json();
    
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: user } = await supabase.auth.getUser(token);
      
      if (!user.user) {
        throw new Error('Unauthorized');
      }

      // Generate AI analysis
      const prompt = `Analyze this job ticket and provide structured recommendations:
      
      Service Type: ${jobData.service_type}
      Customer: ${jobData.customer_name}
      Location: ${jobData.address}
      Priority: ${jobData.priority}
      Status: ${jobData.status}
      Instructions: ${jobData.instructions || 'None provided'}
      
      Please provide:
      1. Recommended actions/tools needed
      2. Time estimate
      3. Potential blockers/risks
      4. Customer considerations
      5. Cost estimate (labor + materials)
      
      Format as JSON with these keys: recommendations, timeEstimate, blockers, customerNotes, costEstimate`;

      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a skilled trade services AI assistant. Provide practical, Quebec-focused job analysis for contractors.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
        }),
      });

      const aiData = await aiResponse.json();
      let analysis;
      
      try {
        analysis = JSON.parse(aiData.choices[0].message.content);
      } catch {
        // Fallback if JSON parsing fails
        analysis = {
          recommendations: ["Check equipment functionality", "Bring standard tools"],
          timeEstimate: "2-3 hours",
          blockers: ["Customer availability", "Parts availability"],
          customerNotes: ["Confirm appointment time", "Verify access to work area"],
          costEstimate: "$75-150 estimated"
        };
      }

      // Update booking with parse status and analysis
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          parsed: true,
          parsed_at: new Date().toISOString(),
          ai_analysis: analysis
        })
        .eq('id', jobId);

      if (updateError) throw updateError;

      // Log the parse event
      const { error: eventError } = await supabase
        .from('job_events')
        .insert({
          job_id: jobId,
          user_id: user.user.id,
          event_type: 'parse',
          metadata: { analysis_generated: true }
        });

      if (eventError) console.error('Event logging failed:', eventError);

      return new Response(JSON.stringify({ 
        success: true, 
        analysis 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('No authorization header');

  } catch (error) {
    console.error('Error in parse-job function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});