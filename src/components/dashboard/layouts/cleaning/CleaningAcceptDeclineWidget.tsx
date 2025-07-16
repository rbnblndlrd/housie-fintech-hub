import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

const CleaningAcceptDeclineWidget: React.FC = () => {
  const pendingJob = {
    id: 1,
    title: 'Deep House Cleaning',
    customer: 'Jennifer Martinez',
    time: '2:00 PM',
    duration: '3 hours',
    amount: 180,
    urgency: 'high'
  };

  return (
    <Card className="fintech-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-orange-500" />
          Quick Action
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="fintech-inner-box p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-sm">{pendingJob.title}</span>
            <Badge variant={pendingJob.urgency === 'high' ? 'destructive' : 'default'}>
              {pendingJob.urgency} priority
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>Client: {pendingJob.customer}</div>
            <div className="flex items-center gap-4">
              <span>{pendingJob.time}</span>
              <span>{pendingJob.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <DollarSign className="h-4 w-4" />
              ${pendingJob.amount}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Accept
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Decline
          </Button>
        </div>
        
        <div className="text-center">
          <Button size="sm" variant="ghost" className="text-xs">
            View All Pending (3)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CleaningAcceptDeclineWidget;