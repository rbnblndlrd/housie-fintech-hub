
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
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
}

// Estimate API cost based on token usage (approximate)
const estimateAPICost = (inputTokens: number, outputTokens: number): number => {
  // Claude 3.5 Sonnet pricing: $3 per 1M input tokens, $15 per 1M output tokens
  const inputCost = (inputTokens / 1000000) * 3;
  const outputCost = (outputTokens / 1000000) * 15;
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
    const { message, sessionId, userId, conversationHistory = [] }: ChatRequest = await req.json();

    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Check emergency controls
    const { data: isEnabled, error: controlsError } = await supabase.rpc('is_claude_api_enabled');
    
    if (controlsError) {
      console.error('Error checking emergency controls:', controlsError);
      throw new Error('Failed to check API availability');
    }

    if (!isEnabled) {
      return new Response(
        JSON.stringify({ 
          error: 'API temporarily disabled',
          response: "🚫 **Claude AI is temporarily unavailable**\n\nOur AI assistant is currently disabled for maintenance or due to usage limits. Please try again later or contact our support team if you need immediate assistance.\n\n*This is an automated safety measure to ensure optimal service quality.*",
          success: false
        }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build the conversation context
    const systemPrompt = `You are HOUSIE AI, a helpful assistant for a home services platform called HOUSIE. 

Your role is to help users with:
- Finding local service providers (cleaning, lawn care, construction, wellness, pet care)
- Providing price estimates and cost comparisons
- Booking assistance and scheduling help
- Service recommendations and tips
- Answering questions about home maintenance and improvements

Key guidelines:
- Be friendly, helpful, and professional
- Provide specific, actionable advice when possible
- Ask clarifying questions to better understand user needs
- Suggest connecting users with verified service providers
- Include relevant cost estimates when discussing services
- Always prioritize user safety and recommend insured/verified providers

Special features:
- If users ask about "tax" or mention "tax?", provide helpful tax information for home services
- If users ask about "pets" or mention "pets?", give pet-related home service advice
- If users ask about "cleaning costs", provide detailed cleaning service estimates
- If users say "test claude" or similar, respond enthusiastically about Claude 4 capabilities
- If users ask about colors or say "show me colors", describe beautiful color palettes for home design

Current context: User is asking about home services through the HOUSIE platform.`;

    const messages = [
      { role: 'user', content: `${systemPrompt}\n\nConversation history: ${JSON.stringify(conversationHistory)}\n\nUser message: ${message}` }
    ];

    // Estimate input tokens
    const inputText = JSON.stringify(messages);
    const estimatedInputTokens = estimateTokens(inputText);

    // Call Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: messages
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const claudeResponse = data.content[0].text;

    // Estimate output tokens and total cost
    const estimatedOutputTokens = estimateTokens(claudeResponse);
    const estimatedCost = estimateAPICost(estimatedInputTokens, estimatedOutputTokens);

    // Log API usage
    const { error: logError } = await supabase
      .from('api_usage_logs')
      .insert({
        user_id: userId,
        session_id: sessionId,
        tokens_used: estimatedInputTokens + estimatedOutputTokens,
        estimated_cost: estimatedCost,
        request_type: 'claude-chat',
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
          content: claudeResponse
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
        response: claudeResponse,
        success: true,
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
    console.error('Error in claude-chat function:', error);
    
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
          request_type: 'claude-chat',
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
