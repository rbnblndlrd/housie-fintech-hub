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
    type?: 'route' | 'bid' | 'profile' | 'cluster' | 'booking' | 'opportunities';
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
    const { message, sessionId, userId, conversationHistory = [], context, pageContext, featureType, creditsUsed }: ChatRequest = await req.json();

    // Map context type to appropriate action name for credit deduction
    let actionName = 'basic_customer_support';
    let creditAmount = 1;
    
    if (featureType) {
      actionName = featureType;
      // Set credit amounts based on feature complexity
      switch (featureType) {
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
    } else if (context?.type) {
      // Fallback context mapping
      switch (context.type) {
        case 'route':
          actionName = 'route_optimization';
          creditAmount = 3;
          break;
        case 'bid':
        case 'opportunities':
          actionName = 'business_insights';
          creditAmount = 2;
          break;
        case 'profile':
        case 'cluster':
          actionName = 'advanced_scheduling';
          creditAmount = 2;
          break;
        default:
          actionName = 'basic_customer_support';
          creditAmount = 1;
      }
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

    const openaiApiKey = Deno.env.get('OPENAI_KEY');
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

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
- "/route" - Focus on route optimization and scheduling
- "/split" - Help with dividing jobs or crews
- "/profile" - Provide profile improvement suggestions

Key guidelines:
- Provide specific, actionable advice
- Ask clarifying questions when needed
- Suggest verified, insured providers when relevant
- Include cost estimates when discussing services
- Prioritize user safety and platform best practices
- Help users maximize their earnings and efficiency

${contextualPrompt ? `Current context: ${contextualPrompt}` : 'Ready to help with any HOUSIE-related questions.'}`;

    // Build conversation content safely
    const conversationContent = `${systemPrompt}\n\nConversation history:\n${JSON.stringify(conversationHistory, null, 2)}\n\nUser message: ${message}`;

    const messages = [
      { role: 'user', content: conversationContent }
    ];

    // Estimate input tokens
    const inputText = JSON.stringify(messages);
    const estimatedInputTokens = estimateTokens(inputText);

    // Call OpenAI API (openaiApiKey already defined above)

const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${openaiApiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o', // You can also use 'gpt-4-turbo'
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ],
    max_tokens: 500,
    temperature: 0.7
  })
});

if (!openaiResponse.ok) {
  throw new Error(`OpenAI API error: ${openaiResponse.status}`);
}

const openaiData = await openaiResponse.json();
const annetteResponse = openaiData.choices[0].message.content;

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
