import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown } from 'lucide-react';

interface ShowcaseCardProps {
  type: 'stamp' | 'fusion';
  data: any;
  theme?: string;
  hasCanonAura?: boolean;
}

export function ShowcaseCard({ type, data, theme, hasCanonAura }: ShowcaseCardProps) {
  return (
    <Card className={`group transition-all duration-300 hover:scale-105 cursor-pointer ${
      hasCanonAura ? 'ring-2 ring-primary/20 shadow-lg shadow-primary/10' : ''
    } ${theme === 'pulse' ? 'bg-gradient-to-br from-card/80 to-primary/5' : 'bg-card/60'}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {type === 'fusion' ? (
            <Crown className="h-4 w-4 text-yellow-500" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
          <span className="font-medium text-sm">
            {type === 'fusion' ? data.definition?.name : data.stamp?.name}
          </span>
        </div>
        {type === 'fusion' && (
          <Badge variant="secondary" className="text-xs">
            x{data.definition?.canon_multiplier || 1.0}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}