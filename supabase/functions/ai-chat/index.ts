
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { message, sessionId, userId, conversationHistory = [] }: ChatRequest = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
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

Current context: User is asking about home services through the HOUSIE platform.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

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
          content: aiResponse
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
        response: aiResponse,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    
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
