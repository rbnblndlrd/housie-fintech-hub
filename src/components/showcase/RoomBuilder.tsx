import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface RoomBuilderProps {
  settings: any;
}

export function RoomBuilder({ settings }: RoomBuilderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Room Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Room builder interface coming soon. Customize your showcase layout here.
        </p>
      </CardContent>
    </Card>
  );
}