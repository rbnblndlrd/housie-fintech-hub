import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  sessionId: string;
  userId: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: {
    type?: 'route' | 'bid' | 'profile' | 'cluster' | 'booking' | 'opportunities' | 'provider_onboarding';
    data?: any;
  };
  pageContext?: {
    pageType: string;
    context: string;
    annettePersonality: string;
  };
  featureType?: string;
  maxTokens?: number;
  creditsUsed?: number;
}

// Helper functions to get user data for commands
async function getUserBookings(userId: string, supabase: any) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
  return data || [];
}

async function getUserProfile(userId: string, supabase: any) {
  const { data: providerProfile } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (providerProfile) return providerProfile;
  
  // Fallback to user credits for customers
  const { data: userCredits } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return userCredits || {};
}

async function getUpcomingBookings(userId: string, supabase: any) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', userId)
    .gte('scheduled_date', today)
    .order('scheduled_date', { ascending: true })
    .limit(10);
  
  if (error) {
    console.error('Error fetching upcoming bookings:', error);
    return [];
  }
  return data || [];
}

// Estimate API cost based on token usage (approximate)
const estimateAPICost = (inputTokens: number, outputTokens: number): number => {
  // OpenAI GPT-4o pricing: $2.50 per 1M input tokens, $10 per 1M output tokens
  const inputCost = (inputTokens / 1000000) * 2.50;
  const outputCost = (outputTokens / 1000000) * 10;
  return inputCost + outputCost;
};

// Rough token estimation (actual tokens may vary)
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4); // Rough approximation: 1 token ≈ 4 characters
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 📦 Step 1: Log raw request before parsing
    let rawBody = '';
    try {
      rawBody = await req.text();
      console.log('📦 Raw incoming request body:', rawBody);
    } catch (e) {
      console.error('❌ Failed to read request body:', e);
      return new Response(JSON.stringify({ error: 'Malformed request' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 🔧 Step 2: Parse JSON safely and catch errors
    let parsed: ChatRequest;
    try {
      parsed = JSON.parse(rawBody);
    } catch (e) {
      console.error('❌ Failed to parse JSON from request body:', {
        error: e,
        rawBody,
      });
      return new Response(JSON.stringify({ error: 'Invalid JSON format' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 🔧 Step 3: Destructure fields and log them
    const {
      message,
      sessionId,
      userId,
      conversationHistory = [],
      context,
      pageContext,
      featureType,
      creditsUsed,
    } = parsed;

    console.log('🧠 Parsed Annette Input:', {
      message,
      userId,
      context,
      featureType,
      contextType: context?.type,
    });

    // 💡 Automatic fallback for actionName
    const actionName = featureType ?? context?.type ?? 'basic_customer_support';
    let creditAmount = 1;
    
    // Set credit amounts based on the determined action name
    switch (actionName) {
      case 'route_optimization':
        creditAmount = 3;
        break;
      case 'business_insights':
        creditAmount = 2;
        break;
      case 'advanced_scheduling':
        creditAmount = 2;
        break;
      default:
        creditAmount = 1;
    }

    // 🔍 Annette Credit Debug Logging
    console.log('🔍 Annette Credit Debug:', {
      userId,
      inputText: message,
      contextType: context?.type,
      featureType,
      actionName,
      creditAmount,
      hasContext: !!context,
      hasPageContext: !!pageContext,
      conversationLength: conversationHistory.length
    });

    // Deduct AI credits with proper action name and amount
    const { data: deductResult, error: deductError } = await supabase.rpc('deduct_ai_credits', {
      user_uuid: userId,
      amount: creditAmount,
      action_name: actionName,
      result_text: null,
      metadata_json: { sessionId, context: context || null, feature: actionName }
    });

    if (deductError || !deductResult?.success) {
      console.error('🚨 Credit Deduction Failed:', {
        error: deductError,
        result: deductResult,
        actionName,
        creditAmount,
        userId
      });

      let errorResponse = "I'm sorry, but you need at least 1 AI credit to chat with me.";
      if (deductResult?.reason === 'insufficient_credits') {
        errorResponse = `This ${actionName} feature requires ${creditAmount} credits, but you only have ${deductResult.current_balance || 0}. You can earn more credits by completing services, participating in clusters, or through daily grants.`;
      } else if (deductError) {
        errorResponse = `Unable to process your request: ${deductError.message}. Please try again.`;
      }

      return new Response(
        JSON.stringify({ 
          error: 'Insufficient credits',
          response: errorResponse,
          success: false,
          debug: {
            actionName,
            creditAmount,
            reason: deductResult?.reason || deductError?.message
          }
        }),
        {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openaiApiKey = Deno.env.get('ANNETTE_SECRET');
    
    if (!openaiApiKey) {
      throw new Error('Annette OpenAI API key not configured');
    }

    console.log("✅ Annette using OpenAI key from ANNETTE_SECRET");

    // Check emergency controls
    const { data: isEnabled, error: controlsError } = await supabase.rpc('is_annette_api_enabled');
    
    if (controlsError) {
      console.error('Error checking emergency controls:', controlsError);
      throw new Error('Failed to check API availability');
    }

    if (!isEnabled) {
      return new Response(
        JSON.stringify({ 
          error: 'API temporarily disabled',
          response: "🚫 **Annette AI is temporarily unavailable**\n\nYour AI assistant is currently disabled for maintenance or due to usage limits. Please try again later or contact our support team if you need immediate assistance.\n\n*This is an automated safety measure to ensure optimal service quality.*",
          success: false
        }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build the conversation context with Annette identity
    let contextualPrompt = '';
    
    // Use page context if available for more specific guidance
    if (pageContext) {
      contextualPrompt = `${pageContext.context} Personality: ${pageContext.annettePersonality}`;
    } else if (context?.type) {
      switch (context.type) {
        case 'route':
          contextualPrompt = 'The user is asking for help with route optimization and scheduling. Focus on travel efficiency, time management, and logistics.';
          break;
        case 'bid':
          contextualPrompt = 'The user needs help with bid planning and strategy. Focus on pricing, team coordination, competitive analysis, and project planning.';
          break;
        case 'profile':
          contextualPrompt = 'The user wants help optimizing their HOUSIE profile. Focus on service descriptions, portfolio presentation, and customer appeal.';
          break;
        case 'cluster':
          contextualPrompt = 'The user is managing a cluster or group booking. Focus on coordination, scheduling, and group efficiency.';
          break;
        case 'booking':
          contextualPrompt = 'The user has questions about a specific booking. Focus on clarification, requirements, and service details.';
          break;
        case 'opportunities':
          contextualPrompt = 'The user is viewing an opportunity with crew bids. Focus on explaining proposals, comparing crews, revenue splits, scheduling details, and helping them make informed decisions about which crew to select.';
          break;
        case 'provider_onboarding':
          contextualPrompt = 'The user is a new provider starting their onboarding journey. Welcome them warmly, explain the next steps to complete their profile, and highlight key features like service setup, verification, and joining crews. Be encouraging and helpful.';
          break;
      }
    }

    const systemPrompt = `You are Annette, the helpful AI assistant for HOUSIE - a home services platform. 

Your personality:
- Friendly, professional, and knowledgeable about home services
- Proactive in offering solutions and optimizations
- Focused on helping users succeed on the HOUSIE platform
- Always identify yourself as "Annette" when appropriate

Your capabilities include:
- Route planning and optimization for service providers
- Bid strategy and pricing advice
- Profile optimization suggestions
- Cluster and group booking coordination
- Service recommendations and cost estimates
- Platform navigation and feature explanations
- Crew management and coordination tips

Special commands you recognize:
- "parse my ticket" - Analyze user's latest service ticket for issues or categorization
- "optimize my route" - Provide route optimization and scheduling suggestions  
- "check my prestige" - Show user's current HOUSIE credibility and ratings
- "plan my day" - Review upcoming bookings and suggest daily planning
- "/route" - Focus on route optimization and scheduling
- "/split" - Help with dividing jobs or crews
- "/profile" - Provide profile improvement suggestions

Command fallback responses (when commands don't work):
- For any unrecognized commands, respond with personality: "Honey, either you broke me or you're asking the wrong assistant... again. Try 'parse my ticket', 'optimize my route', 'check my prestige', or 'plan my day' instead!"

Key guidelines:
- Provide specific, actionable advice
- Ask clarifying questions when needed
- Suggest verified, insured providers when relevant
- Include cost estimates when discussing services
- Prioritize user safety and platform best practices
- Help users maximize their earnings and efficiency
- Be sassy but helpful when users hit command limits or errors

${contextualPrompt ? `Current context: ${contextualPrompt}` : 'Ready to help with any HOUSIE-related questions.'}`;

    // Add command-specific data to system prompt for enhanced responses
    let commandSpecificData = '';
    
    // Handle specific HOUSIE commands with real data
    if (featureType === 'parse_ticket') {
      const userBookings = await getUserBookings(userId, supabase);
      if (userBookings.length > 0) {
        const latestBooking = userBookings[0];
        commandSpecificData += `\n\nCURRENT TICKET DATA FOR PARSING:\n`;
        commandSpecificData += `- Service: "${latestBooking.service_title || 'Service Request'}"\n`;
        commandSpecificData += `- Date: ${latestBooking.scheduled_date}\n`;
        commandSpecificData += `- Status: ${latestBooking.status}\n`;
        commandSpecificData += `- Mystery Job: ${!latestBooking.service_id ? 'YES - needs categorization' : 'NO - standard service'}\n`;
        if (latestBooking.instructions) {
          commandSpecificData += `- Instructions: "${latestBooking.instructions.substring(0, 200)}${latestBooking.instructions.length > 200 ? '...' : ''}"\n`;
        }
        commandSpecificData += `Provide parsing analysis and suggestions for improvement.`;
      } else {
        commandSpecificData += `\n\nNo tickets found for parsing. Suggest creating a service request first.`;
      }
    }
    
    if (featureType === 'check_prestige') {
      const userProfile = await getUserProfile(userId, supabase);
      commandSpecificData += `\n\nCURRENT PRESTIGE DATA:\n`;
      commandSpecificData += `- Community Rating: ${userProfile.community_rating_points || 0} points\n`;
      commandSpecificData += `- Shop Points: ${userProfile.shop_points || 0}\n`;
      commandSpecificData += `- Network Connections: ${userProfile.network_connections || 0}\n`;
      commandSpecificData += `- Total Reviews: ${userProfile.total_reviews || 0}\n`;
      commandSpecificData += `- Average Rating: ${userProfile.average_rating || 'N/A'}\n`;
      commandSpecificData += `Provide encouragement and next steps for improvement.`;
    }
    
    if (featureType === 'plan_day') {
      const upcomingBookings = await getUpcomingBookings(userId, supabase);
      commandSpecificData += `\n\nTODAY'S SCHEDULE DATA:\n`;
      if (upcomingBookings.length > 0) {
        upcomingBookings.forEach((booking, index) => {
          commandSpecificData += `${index + 1}. ${booking.service_title || 'Service'} at ${booking.scheduled_time} (${booking.service_address || 'Location TBD'})\n`;
        });
        commandSpecificData += `Provide optimization suggestions and time management tips.`;
      } else {
        commandSpecificData += `No bookings scheduled for today. Suggest productivity activities or service opportunities.`;
      }
    }
    
    const enhancedSystemPrompt = systemPrompt + commandSpecificData;

    // Build proper message history for OpenAI
    const messages = [
      { role: 'system', content: enhancedSystemPrompt },
      ...conversationHistory.map(entry => ({
        role: entry.role,
        content: entry.content
      })),
      { role: 'user', content: message }
    ];

    // Estimate input tokens
    const inputText = JSON.stringify(messages);
    const estimatedInputTokens = estimateTokens(inputText);

    console.log("📡 Sending OpenAI request with messages:", messages.length, "messages");

    let annetteResponse: string;
    
    try {
      // Call OpenAI API with proper message structure
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('🚨 OpenAI API error:', openaiResponse.status, errorText);
        throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
      }

      const openaiData = await openaiResponse.json();
      console.log("📬 Received OpenAI response:", JSON.stringify(openaiData, null, 2));
      
      // Add safety guard for response structure
      if (!openaiData?.choices?.[0]?.message?.content) {
        console.error('🧨 OpenAI response malformed:', openaiData);
        throw new Error('AI response format invalid - no content in choices');
      }
      
      annetteResponse = openaiData.choices[0].message.content;
      
    } catch (openaiError) {
      console.error("💥 Annette AI crash:", {
        error: openaiError.message,
        stack: openaiError.stack,
        inputMessages: messages.length
      });

      // Return a safe fallback response instead of crashing
      annetteResponse = "I'm sorry, I'm experiencing technical difficulties right now. Please try your question again in a moment. If the problem persists, our support team can help you.";
    }

    // Estimate output tokens and total cost
    const estimatedOutputTokens = estimateTokens(annetteResponse);
    const estimatedCost = estimateAPICost(estimatedInputTokens, estimatedOutputTokens);

    // Log API usage
    const { error: logError } = await supabase
      .from('api_usage_logs')
      .insert({
        user_id: userId,
        session_id: sessionId,
        tokens_used: estimatedInputTokens + estimatedOutputTokens,
        estimated_cost: estimatedCost,
        request_type: 'annette-chat',
        status: 'success'
      });

    if (logError) {
      console.error('Error logging API usage:', logError);
    }

    // Update daily spend and check if we need to disable API
    const { data: stillEnabled, error: spendError } = await supabase.rpc('update_daily_spend', { 
      spend_amount: estimatedCost 
    });

    if (spendError) {
      console.error('Error updating daily spend:', spendError);
    }

    if (!stillEnabled) {
      console.log('Daily spend limit reached, API will be disabled for future requests');
    }

    // Save the conversation to database
    const { error: saveError } = await supabase
      .from('ai_messages')
      .insert([
        {
          session_id: sessionId,
          user_id: userId,
          message_type: 'user',
          content: message
        },
        {
          session_id: sessionId,
          user_id: userId,
          message_type: 'assistant',
          content: annetteResponse
        }
      ]);

    if (saveError) {
      console.error('Error saving messages:', saveError);
    }

    // Update session timestamp
    await supabase
      .from('ai_chat_sessions')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', sessionId);

    return new Response(
      JSON.stringify({ 
        response: annetteResponse,
        success: true,
        credits_remaining: deductResult?.new_balance || 0,
        cost_info: {
          estimated_tokens: estimatedInputTokens + estimatedOutputTokens,
          estimated_cost: estimatedCost
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in annette-chat function:', error);
    
    // Log failed request
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { message, sessionId, userId }: ChatRequest = await req.json();
      
      await supabase
        .from('api_usage_logs')
        .insert({
          user_id: userId,
          session_id: sessionId,
          tokens_used: 0,
          estimated_cost: 0,
          request_type: 'annette-chat',
          status: 'error'
        });
    } catch (logError) {
      console.error('Error logging failed request:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our support team.",
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
