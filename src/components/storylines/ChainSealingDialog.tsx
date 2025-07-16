import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CanonicalChain } from '@/hooks/useStorylines';
import { Lock, Gem, AlertTriangle } from 'lucide-react';

interface ChainSealingDialogProps {
  chain: CanonicalChain;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSeal: (finalStampId?: string, annotation?: string) => Promise<any>;
  finalStampId?: string;
}

export function ChainSealingDialog({ 
  chain, 
  open, 
  onOpenChange, 
  onSeal,
  finalStampId 
}: ChainSealingDialogProps) {
  const [annotation, setAnnotation] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [sealingMode, setSealingMode] = useState<'standard' | 'mint'>('standard');

  const handleSeal = async () => {
    setIsSealing(true);
    try {
      const result = await onSeal(finalStampId, annotation || undefined);
      if (result.success) {
        onOpenChange(false);
        setAnnotation('');
      }
    } finally {
      setIsSealing(false);
    }
  };

  const prestigeTitle = {
    'wellness_whisperer': 'Wellness Whisperer',
    'neighborhood_hero': 'Neighborhood Hero', 
    'road_warrior': 'Road Warrior',
    'excellence_pursuit': 'Excellence Seeker'
  }[chain.theme] || 'Chain Completer';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            Seal Canonical Chain
          </DialogTitle>
          <DialogDescription>
            You're about to seal "{chain.title}" permanently. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Chain Preview */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{chain.theme.replace('_', ' ')}</Badge>
              <Badge variant="secondary">{chain.chain_sequence?.length || 0} stamps</Badge>
            </div>
            <h3 className="font-medium">{chain.title}</h3>
            {chain.description && (
              <p className="text-sm text-muted-foreground mt-1">{chain.description}</p>
            )}
          </div>

          {/* Rewards Preview */}
          <div className="rounded-lg border bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4">
            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
              Sealing Rewards
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                  {prestigeTitle}
                </Badge>
                <span className="text-amber-700 dark:text-amber-300">Title Unlocked</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                <span>+50 Prestige Score</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                <span>📡 Echo Feed Broadcast</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-700 dark:text-orange-300">
              Once sealed, you cannot add more stamps to this chain. Consider if you want to continue building this story.
            </div>
          </div>

          {/* Optional Annotation */}
          <div className="space-y-2">
            <Label htmlFor="annotation">Personal Note (Optional)</Label>
            <Textarea
              id="annotation"
              placeholder="Why are you sealing this chain here? What does this moment mean to you?"
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Sealing Mode Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={sealingMode === 'standard' ? 'default' : 'outline'}
              onClick={() => setSealingMode('standard')}
              className="h-auto p-3 flex flex-col items-center gap-1"
            >
              <Lock className="h-4 w-4" />
              <span className="text-xs">Seal & Continue</span>
            </Button>
            <Button
              variant={sealingMode === 'mint' ? 'default' : 'outline'}
              onClick={() => setSealingMode('mint')}
              className="h-auto p-3 flex flex-col items-center gap-1"
              disabled
            >
              <Gem className="h-4 w-4" />
              <span className="text-xs">Seal & Mint</span>
              <span className="text-xs text-muted-foreground">(Coming Soon)</span>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSealing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSeal}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
              disabled={isSealing}
            >
              {isSealing ? 'Sealing...' : `Seal Chain`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}