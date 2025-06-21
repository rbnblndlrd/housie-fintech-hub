
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const FraudDetectionLoading = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FraudDetectionLoading;
