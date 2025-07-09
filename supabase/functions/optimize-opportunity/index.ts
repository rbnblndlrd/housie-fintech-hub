import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AI_NAME = "Annette";
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the authorization header and verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Check and deduct AI credits (1 credit for opportunity optimization)
    const { data: creditResult, error: creditError } = await supabase.rpc('deduct_ai_credits', {
      user_uuid: user.id,
      amount: 1,
      action_name: 'optimize_opportunity'
    });

    if (creditError) {
      console.error('Credit check failed:', creditError);
      throw new Error('Failed to process AI credits');
    }

    if (!creditResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Insufficient AI credits',
        current_balance: creditResult.current_balance,
        required: creditResult.required
      }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`AI credits deducted. New balance: ${creditResult.new_balance}`);

    const { opportunity_id, crew_id } = await req.json();

    if (!opportunity_id || !crew_id) {
      throw new Error('Missing opportunity_id or crew_id');
    }

    console.log(`Processing optimization request for opportunity ${opportunity_id} by crew ${crew_id}`);

    // 1. Validate crew access - user must be a crew member
    const { data: crewMember, error: crewError } = await supabase
      .from('crew_members')
      .select('role')
      .eq('crew_id', crew_id)
      .eq('user_id', user.id)
      .single();

    if (crewError || !crewMember) {
      throw new Error('Access denied: Not a member of this crew');
    }

    // 2. Fetch opportunity details
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunity_id)
      .single();

    if (oppError || !opportunity) {
      throw new Error('Opportunity not found');
    }

    if (!['open', 'bidding'].includes(opportunity.status)) {
      throw new Error('Opportunity is not available for bidding');
    }

    // 3. Fetch required service slots
    const { data: serviceSlots, error: slotsError } = await supabase
      .from('opportunity_service_slots')
      .select('*')
      .eq('opportunity_id', opportunity_id);

    if (slotsError) {
      throw new Error('Failed to fetch service slots');
    }

    // 4. Fetch crew members with user profiles
    const { data: crewMembers, error: membersError } = await supabase
      .from('crew_members')
      .select(`
        user_id,
        role,
        users:user_id (
          full_name
        )
      `)
      .eq('crew_id', crew_id);

    if (membersError) {
      throw new Error('Failed to fetch crew members');
    }

    // 5. Use AI to optimize the schedule and splits
    const optimizationPrompt = `You are Annette, HOUSIE's AI crew scheduling assistant. Help optimize a crew bid for a multi-service job opportunity.

OPPORTUNITY DETAILS:
- Title: ${opportunity.title}
- Date: ${opportunity.preferred_date}
- Time Window: ${opportunity.time_window_start} - ${opportunity.time_window_end}
- Description: ${opportunity.description}

REQUIRED SERVICES:
${serviceSlots.map(slot => `- ${slot.service_type}${slot.title ? ` (${slot.title})` : ''}`).join('\n')}

AVAILABLE CREW MEMBERS:
${crewMembers.map(member => `- ${member.users?.full_name || 'Unknown'} (${member.role || 'Member'})`).join('\n')}

TASK: Create an optimized schedule and revenue split.

RULES:
1. Assign each service to a crew member (can be same person for multiple services)
2. Default 60 minutes per service, adjust if needed
3. Add 10-minute buffers between different services
4. Stay within the time window
5. Revenue split should be proportional to work time
6. Return valid JSON only

REQUIRED OUTPUT FORMAT:
{
  "success": true,
  "summary": "Brief description of the schedule",
  "crew_schedule": [
    {
      "member": "Member Name",
      "member_id": "user_id_here",
      "role": "Service Type",
      "start": "HH:MM",
      "end": "HH:MM"
    }
  ],
  "revenue_split": {
    "user_id_1": 0.50,
    "user_id_2": 0.50
  },
  "confidence": "high|medium|low"
}`;

    let aiResponse;
    if (anthropicApiKey) {
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: optimizationPrompt
            }
          ]
        })
      });

      if (!anthropicResponse.ok) {
        throw new Error('Failed to get AI optimization');
      }

      const anthropicData = await anthropicResponse.json();
      const aiContent = anthropicData.content[0]?.text;
      
      try {
        aiResponse = JSON.parse(aiContent);
      } catch (parseError) {
        console.error('Failed to parse AI response:', aiContent);
        throw new Error('Invalid AI response format');
      }
    } else {
      // Fallback logic when AI is not available
      const timeStart = opportunity.time_window_start;
      const [startHour, startMin] = timeStart.split(':').map(Number);
      let currentTime = startHour * 60 + startMin; // Convert to minutes

      const schedule = [];
      const memberCount = crewMembers.length;
      const slotsPerMember = Math.ceil(serviceSlots.length / memberCount);

      for (let i = 0; i < serviceSlots.length; i++) {
        const member = crewMembers[i % memberCount];
        const slot = serviceSlots[i];
        
        const startTimeStr = `${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`;
        currentTime += 60; // 60 minutes per task
        const endTimeStr = `${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`;
        
        if (i < serviceSlots.length - 1) {
          currentTime += 10; // 10-minute buffer
        }

        schedule.push({
          member: member.users?.full_name || 'Unknown',
          member_id: member.user_id,
          role: slot.service_type,
          start: startTimeStr,
          end: endTimeStr
        });
      }

      // Equal revenue split for fallback
      const splitPerMember = 1 / memberCount;
      const revenueSplit = {};
      crewMembers.forEach(member => {
        revenueSplit[member.user_id] = Math.round(splitPerMember * 100) / 100;
      });

      aiResponse = {
        success: true,
        summary: `Suggested ${schedule.length} service schedule across ${memberCount} crew members`,
        crew_schedule: schedule,
        revenue_split: revenueSplit,
        confidence: "medium"
      };
    }

    console.log('Optimization completed successfully');

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in optimize-opportunity function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});