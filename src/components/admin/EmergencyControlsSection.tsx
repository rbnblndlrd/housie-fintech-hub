
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

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
        <div className="text-center p-8">
          <p className="text-gray-600 mb-4">No emergency controls found. Please contact system administrator.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyControlsSection;
