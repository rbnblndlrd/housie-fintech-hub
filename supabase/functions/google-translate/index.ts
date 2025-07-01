
import { corsHeaders } from '../_shared/cors.ts';

const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLang = 'fr', sourceLang = 'en' } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
    if (!apiKey) {
      console.error('Google Translate API key not found');
      return new Response(
        JSON.stringify({ error: 'Translation service not configured', originalText: text }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Google Translate API
    const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: sourceLang,
        format: 'text'
      }),
    });

    if (!response.ok) {
      console.error('Google Translate API error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ error: 'Translation failed', originalText: text }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const translatedText = data.data?.translations?.[0]?.translatedText || text;

    return new Response(
      JSON.stringify({ 
        translatedText,
        originalText: text,
        sourceLang,
        targetLang 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
