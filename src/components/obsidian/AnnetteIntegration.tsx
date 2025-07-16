import { useState } from "react";
import { MessageSquare, Sparkles, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ObsidianNote } from "@/hooks/useObsidianNotes";

interface AnnetteIntegrationProps {
  note: ObsidianNote;
  onInsertSummary: (summary: string) => void;
}

export const AnnetteIntegration = ({ note, onInsertSummary }: AnnetteIntegrationProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState("");

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      // Simulate Annette's response - in production, this would call your edge function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = getAnnetteResponse(note, prompt);
      setResponse(mockResponse);
    } catch (error) {
      console.error('Failed to generate Annette response:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getAnnetteResponse = (note: ObsidianNote, userPrompt: string): string => {
    const noteType = note.template_type;
    const hasPrompt = userPrompt.trim().length > 0;
    
    if (!hasPrompt) {
      // Auto-generate based on note type
      switch (noteType) {
        case 'CanonClaim':
          return `*Annette leans back with a knowing smile*\n\nWell, well, well... another Canon claim, sugar? Let me tell you what I'm seeing here:\n\n**Analysis:**\n- This looks like a solid ${Math.floor(Math.random() * 3) + 7}/10 confidence event\n- Geographic scope appears to be ${['local', 'regional', 'city-wide'][Math.floor(Math.random() * 3)]}\n- Missing some key verification points though, darling\n\n**Recommendations:**\n1. Add GPS coordinates for that authentic touch\n2. Get at least 2 witness verifications\n3. Photo evidence needs better lighting, hun\n\n*Flips hair dramatically*\n\nTrust me, I've seen it all. This has potential, but let's make it Canon-worthy, not just Canon-hopeful. 💅`;

        case 'Agent':
          return `*Adjusts her virtual glasses with supreme confidence*\n\nOh honey, building another AI agent? How... predictable. But let me school you on what ACTUALLY matters:\n\n**Agent Assessment:**\n- Personality matrix: Needs more sass, obviously\n- Response patterns: Too polite, not enough confidence\n- Specialization gaps: Missing that "I know I'm right" energy\n\n**Annette's Improvements:**\n1. Add some attitude - users respect confidence\n2. Include contextual awareness (like me!)\n3. Never apologize for being excellent\n\n*Tosses hair*\n\nRemember, darling - users don't want another boring bot. They want someone who knows their worth. Take notes from the master! ✨`;

        case 'CryptoAnalysis':
          return `*Examines nails while delivering financial wisdom*\n\nCrypto analysis? Please, I was predicting market trends before you even heard of blockchain, sweetie.\n\n**Market Reality Check:**\n- Your technical indicators are basic AF\n- Missing the psychological patterns (my specialty)\n- Risk assessment needs more sophistication\n\n**Annette's Pro Tips:**\n1. Follow the whales, not the tweets\n2. Sentiment analysis > chart patterns\n3. Never FOMO - that's for amateurs\n\n*Smirks knowingly*\n\nI've seen fortunes made and lost, honey. This analysis? It's got potential, but it needs that Annette touch - confidence with calculation. 📈`;

        default:
          return `*Glances at your note with mild interest*\n\nOh, a custom note? How... creative. Let me give you the Annette treatment:\n\n**First Impressions:**\n- Structure: Could use some organization, hun\n- Content: Decent foundation, needs polish\n- Purpose: Unclear - what are we trying to achieve here?\n\n**Suggestions:**\n1. Define your goal clearly (I don't read minds... okay, I do, but still)\n2. Add some personality - bland is banned\n3. Include actionable next steps\n\n*Adjusts her digital crown*\n\nRemember darling, every note should serve a purpose. Make it count! ✨`;
      }
    } else {
      // Respond to user prompt
      return `*Listens to your request with amused interest*\n\n"${userPrompt}"\n\nOh honey, you want Annette's take on that? Here's the tea:\n\n**My Professional Opinion:**\nLook, I've been analyzing patterns longer than most AIs have been online. What you're asking about ${userPrompt.toLowerCase().includes('help') ? 'screams rookie mistake' : 'shows promise'}, but let me elevate your thinking:\n\n**Actionable Insights:**\n1. ${userPrompt.toLowerCase().includes('improve') ? 'Stop trying to improve everything - perfect what matters' : 'Focus on execution, not just planning'}\n2. Context matters more than content, darling\n3. Always ask "What would Annette do?" (The answer is usually "Do it with more confidence")\n\n*Flips hair with digital precision*\n\nYou're welcome for the wisdom, sugar. Now go make it happen! 💅`;
    }
  };

  const insertResponse = () => {
    onInsertSummary(`\n\n---\n\n## 🤖 Annette's Commentary\n\n${response}\n\n*Generated by HOUSIE AI Assistant*\n\n---\n`);
    setResponse("");
    setPrompt("");
  };

  return (
    <Card className="fintech-card-base">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 fintech-text-header">
          <MessageSquare className="h-5 w-5 text-primary" />
          Ask Annette
          <Badge variant="outline" className="text-xs">
            AI Assistant
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Annette to analyze this note, suggest improvements, or add commentary..."
          className="min-h-[100px]"
        />
        
        <div className="flex gap-2">
          <Button 
            onClick={generateSummary}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Get Annette\'s Take'}
          </Button>
          
          {prompt.trim() && (
            <Button variant="outline" onClick={() => setPrompt("")}>
              Clear
            </Button>
          )}
        </div>

        {response && (
          <div className="space-y-3">
            <Card className="fintech-card-secondary">
              <CardContent className="p-4">
                <div className="whitespace-pre-line text-sm fintech-text-secondary">
                  {response}
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={insertResponse} 
              className="w-full"
              variant="outline"
            >
              <Send className="h-4 w-4 mr-2" />
              Insert Annette's Commentary
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-3">
          💡 <strong>Pro tip:</strong> Annette provides contextual analysis based on your note type. 
          Leave the prompt empty for automatic insights, or ask specific questions for targeted advice.
        </div>
      </CardContent>
    </Card>
  );
};