import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, Save, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PAGE_OPTIONS = ['welcome', 'booking', 'calendar', 'dashboard', 'analytics', 'profile'];

const TONE_TIERS = [
  { value: 'rookie', label: 'Rookie - New and eager' },
  { value: 'trying', label: 'Trying - Making effort' },
  { value: 'respected', label: 'Respected - Solid performer' },
  { value: 'slipping', label: 'Slipping - Lost momentum' },
  { value: 'complacent', label: 'Complacent - Too comfortable' }
];

const CATEGORIES = [
  'Power Humblebrags™',
  'Calendar Roasts™',
  'Onboarding Lies™',
  'Booking Encouragements',
  'Analytics Smacktalk',
  'System Error Softens',
  'Hype Mode',
  'Sarcastic Truth Bombs'
];

interface GeneratedQuote {
  text: string;
  page: string;
  tier: string;
  category: string;
  source: string;
}

export default function QuoteGenerator() {
  const [page, setPage] = useState<string>('');
  const [tier, setTier] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [generatedQuote, setGeneratedQuote] = useState<GeneratedQuote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!page || !tier || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating a quote.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-annette-quote', {
        body: { page, tier, category }
      });

      if (error) throw error;

      setGeneratedQuote(data);
      toast({
        title: "Quote Generated!",
        description: "Annette has spoken. Review and save if you like it.",
      });
    } catch (error) {
      console.error('Error generating quote:', error);
      toast({
        title: "Generation Failed",
        description: "Couldn't generate a quote. Try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedQuote) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('annette_quotes')
        .insert({
          text: generatedQuote.text,
          page: generatedQuote.page,
          category: generatedQuote.category,
          tier: generatedQuote.tier,
          source: generatedQuote.source,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Quote Saved!",
        description: "Added to the Annette Quote Vault successfully.",
      });

      // Reset form
      setGeneratedQuote(null);
      setPage('');
      setTier('');
      setCategory('');
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: "Save Failed",
        description: "Couldn't save the quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Annette Quote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page">Page Context</Label>
              <Select value={page} onValueChange={setPage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier">Tone Tier</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_TIERS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !page || !tier || !category}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Quote
                </>
              )}
            </Button>
            
            {generatedQuote && (
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedQuote && (
        <Card className="bg-muted/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Generated Quote Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  A
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Annette says:</p>
                  <p className="text-base font-medium leading-relaxed">"{generatedQuote.text}"</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex gap-4">
                <span>Page: <span className="font-medium">{generatedQuote.page}</span></span>
                <span>Tier: <span className="font-medium">{generatedQuote.tier}</span></span>
                <span>Category: <span className="font-medium">{generatedQuote.category}</span></span>
              </div>
              <span>Source: {generatedQuote.source}</span>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save to Quote Vault
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}