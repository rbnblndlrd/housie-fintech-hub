
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User, DollarSign, Check, X } from 'lucide-react';

interface JobRequest {
  id: string;
  title: string;
  description: string;
  client: string;
  location: string;
  estimatedDuration: number;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  budget: number;
  requestedTime: string;
  createdAt: string;
}

const IncomingJobRequests: React.FC = () => {
  const incomingRequests: JobRequest[] = [
    {
      id: 'req-1',
      title: 'Emergency Water Heater Repair',
      description: 'Water heater completely stopped working, need immediate assistance',
      client: 'Sarah Connor',
      location: 'Downtown Montreal',
      estimatedDuration: 90,
      urgency: 'emergency',
      budget: 350,
      requestedTime: 'ASAP',
      createdAt: '5 min ago'
    },
    {
      id: 'req-2',
      title: 'Kitchen Sink Installation',
      description: 'New kitchen sink needs professional installation',
      client: 'Mike Johnson',
      location: 'Westmount',
      estimatedDuration: 120,
      urgency: 'medium',
      budget: 200,
      requestedTime: 'Tomorrow morning',
      createdAt: '15 min ago'
    },
    {
      id: 'req-3',
      title: 'Bathroom Faucet Replacement',
      description: 'Old faucet leaking, needs replacement',
      client: 'Emma Wilson',
      location: 'NDG',
      estimatedDuration: 60,
      urgency: 'low',
      budget: 150,
      requestedTime: 'This week',
      createdAt: '1 hour ago'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accepting request:', requestId);
    // Logic to accept job request and convert to ticket
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // Logic to reject job request
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Incoming Job Requests</h3>
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {incomingRequests.length} pending
        </Badge>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {incomingRequests.map((request) => (
          <Card key={request.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{request.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{request.client}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{request.estimatedDuration}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${request.budget}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency}
                    </Badge>
                    <span className="text-xs text-gray-500">Requested: {request.requestedTime}</span>
                    <span className="text-xs text-gray-400">• {request.createdAt}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleAcceptRequest(request.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleRejectRequest(request.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IncomingJobRequests;
