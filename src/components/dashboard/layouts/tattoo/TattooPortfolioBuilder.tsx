import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Image, Plus } from 'lucide-react';

const TattooPortfolioBuilder: React.FC = () => {
  const recentWork = [
    { id: 1, client: 'Recent Session', style: 'Geometric', date: 'Today' },
    { id: 2, client: 'Portfolio Piece', style: 'Watercolor', date: 'Yesterday' },
    { id: 3, client: 'Touch-up', style: 'Traditional', date: '2 days ago' }
  ];

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-pink-500" />
          Portfolio Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button size="sm" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Photo
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Take Photo
          </Button>
        </div>
        
        <div className="fintech-inner-box p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Recent Work</span>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {recentWork.map((work) => (
              <div key={work.id} className="flex items-center gap-2 text-xs">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded flex items-center justify-center">
                  <Image className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{work.client}</div>
                  <div className="text-muted-foreground">{work.style} • {work.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="fintech-inner-box p-3">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">47</div>
            <div className="text-xs text-muted-foreground">Portfolio pieces this month</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TattooPortfolioBuilder;