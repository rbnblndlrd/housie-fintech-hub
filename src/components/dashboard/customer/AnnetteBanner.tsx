import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface AnnetteBannerProps {
  mysteryJobCount: number;
  tone?: 'humorous' | 'helpful';
}

const AnnetteBanner: React.FC<AnnetteBannerProps> = ({ mysteryJobCount, tone = 'humorous' }) => {
  const getMessage = () => {
    if (mysteryJobCount === 1) {
      return "1 mystery job detected! I can try figuring it out, or you can stop stressing me out and just select a service. 😤";
    }
    return `${mysteryJobCount} mystery jobs detected! I can try figuring them out, or you can stop stressing me out and just select a service. 😤`;
  };

  return (
    <Card className="fintech-inner-box p-4 mb-4 border-orange-200 bg-orange-50/50">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-orange-900">💬 Annette</span>
          </div>
          <p className="text-sm text-orange-800">
            "{getMessage()}"
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AnnetteBanner;