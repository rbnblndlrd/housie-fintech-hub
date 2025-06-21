
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import EmergencyControlsDashboard from './emergency/EmergencyControlsDashboard';

const EmergencyControlsSection = () => {
  return (
    <Card className="fintech-chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Emergency Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmergencyControlsDashboard />
      </CardContent>
    </Card>
  );
};

export default EmergencyControlsSection;
