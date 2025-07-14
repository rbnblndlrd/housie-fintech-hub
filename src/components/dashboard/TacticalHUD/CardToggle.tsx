import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';

interface CardView {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface CardToggleProps {
  title: string;
  icon: LucideIcon;
  views: CardView[];
  className?: string;
  defaultViewIndex?: number;
}

export const CardToggle: React.FC<CardToggleProps> = ({ 
  title, 
  icon: Icon, 
  views, 
  className = "",
  defaultViewIndex = 0
}) => {
  const [currentViewIndex, setCurrentViewIndex] = useState(defaultViewIndex);

  const nextView = () => {
    setCurrentViewIndex((prev) => (prev + 1) % views.length);
  };

  const prevView = () => {
    setCurrentViewIndex((prev) => (prev - 1 + views.length) % views.length);
  };

  const currentView = views[currentViewIndex];

  return (
    <Card className={`bg-card/95 backdrop-blur-md border-border/20 shadow-lg relative ${className}`}>
      {/* Toggle Controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevView}
          className="h-6 w-6 p-0 hover:bg-muted/50"
          title="Previous view"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextView}
          className="h-6 w-6 p-0 hover:bg-muted/50"
          title="Next view"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{currentView.title}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="transition-all duration-200">
          {currentView.content}
        </div>
      </CardContent>
    </Card>
  );
};