import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AnchorCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const AnchorCard: React.FC<AnchorCardProps> = ({ 
  title, 
  icon: Icon, 
  children, 
  className = "" 
}) => {
  return (
    <Card 
      className={`
        fixed bottom-4 left-4 w-60 h-48 
        bg-card/95 backdrop-blur-md border-border/20 shadow-xl
        z-40 transition-all duration-300 hover:shadow-2xl
        hidden lg:block
        ${className}
      `}
      style={{ marginLeft: '288px' }} // Account for sidebar width (72 * 4 = 288px)
    >
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 h-full overflow-hidden">
        {children}
      </CardContent>
    </Card>
  );
};