
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface FraudAlertsSectionProps {
  realtimeAlerts: any[];
}

const FraudAlertsSection: React.FC<FraudAlertsSectionProps> = ({ realtimeAlerts }) => {
  if (realtimeAlerts.length === 0) return null;

  return (
    <Card className="bg-red-50 border-red-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
          <p className="text-red-800 font-medium">
            {realtimeAlerts.length} new fraud alert(s) in the last 24 hours
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudAlertsSection;
