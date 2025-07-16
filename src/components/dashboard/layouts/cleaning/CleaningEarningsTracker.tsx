import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const CleaningEarningsTracker: React.FC = () => {
  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Earnings Today
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="fintech-inner-box p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-600">$185</div>
            <div className="text-xs text-muted-foreground">3 jobs</div>
          </div>
          
          <div className="fintech-inner-box p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">$120</div>
            <div className="text-xs text-muted-foreground">2 jobs</div>
          </div>
        </div>
        
        <div className="fintech-inner-box p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Daily Goal Progress</span>
            <span className="text-sm text-muted-foreground">$305 / $400</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '76%'}}></div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            76% complete
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CleaningEarningsTracker;