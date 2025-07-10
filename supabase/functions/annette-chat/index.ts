// /supabase/functions/annette-chat/index.ts

import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_KEY'),
});

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { messages, sessionId, contextType = 'default' } = await req.json();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  const userId = user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const creditCheck = await supabaseClient.rpc('deduct_ai_credits', {
    user_uuid: userId,
    amount: 1,
    action_name: 'annette_chat',
    result_text: `Session: ${sessionId}`,
    metadata_json: { contextType },
  });

  if (!creditCheck.data?.success) {
    return new Response(JSON.stringify({ error: 'Insufficient credits' }), { status: 402 });
  }

  const systemPrompt = `You are Annette, the official AI assistant for HOUSIE — a gig economy platform that helps people hire local workers. 
You are polite, helpful, and always context-aware.
The user is currently in the '${contextType}' section of the app.
Only answer questions that make sense in this context. You never break character.
Be friendly, concise, and clear. If you're asked a question about services, scheduling, routes, clusters, bookings, jobs, or safety, respond with trust-first logic.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
});
