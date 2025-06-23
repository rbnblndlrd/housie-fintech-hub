
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  MessageCircle,
  Calendar
} from 'lucide-react';

interface CustomerMapModeProps {
  onPostJob: () => void;
  availableProviders: number;
  avgResponseTime: string;
  onProviderMessage: (providerId: string) => void;
}

const CustomerMapMode: React.FC<CustomerMapModeProps> = ({
  onPostJob,
  availableProviders,
  avgResponseTime,
  onProviderMessage
}) => {
  const [serviceType, setServiceType] = useState('');
  const [urgency, setUrgency] = useState('normal');

  return (
    <div className="space-y-4">
      {/* Post Job Floating Action */}
      <div className="fixed bottom-6 right-6 z-20">
        <Button
          onClick={onPostJob}
          size="lg"
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Quick Service Search */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Search className="h-5 w-5" />
            Find Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger>
              <SelectValue placeholder="What service do you need?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleaning">House Cleaning</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="handyman">Handyman</SelectItem>
              <SelectItem value="gardening">Gardening</SelectItem>
            </SelectContent>
          </Select>

          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger>
              <SelectValue placeholder="When do you need it?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emergency">Emergency (Now)</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="normal">No Rush</SelectItem>
            </SelectContent>
          </Select>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Find Providers
          </Button>
        </CardContent>
      </Card>

      {/* Market Overview for Customers */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Your Area
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available Providers</span>
              <Badge variant="secondary">{availableProviders}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Response Time</span>
              <span className="text-sm font-medium text-green-600">{avgResponseTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Price Range</span>
              <span className="text-sm font-medium">$25-65/hour</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-12">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" className="h-12">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerMapMode;
