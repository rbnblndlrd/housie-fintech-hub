
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const CalendarWidget = () => {
  const todayJobs = [
    {
      id: 1,
      time: '09:00 AM',
      client: 'Sarah Johnson',
      service: 'Plumbing Repair',
      location: 'Downtown Montreal',
      status: 'confirmed',
      priority: 'high'
    },
    {
      id: 2,
      time: '11:30 AM',
      client: 'Mike Chen',
      service: 'HVAC Maintenance',
      location: 'Westmount',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      time: '02:00 PM',
      client: 'Lisa Martin',
      service: 'Electrical Check',
      location: 'NDG',
      status: 'confirmed',
      priority: 'low'
    },
    {
      id: 4,
      time: '04:30 PM',
      client: 'Robert Wilson',
      service: 'Home Cleaning',
      location: 'Plateau',
      status: 'confirmed',
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="autumn-card-fintech-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            Today's Schedule
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg font-bold border-2 border-blue-200">
            {todayJobs.length} Jobs
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {todayJobs.map((job) => (
            <div key={job.id} className="flex items-center gap-4 p-4 bg-white/80 rounded-xl border-3 border-amber-200 hover:border-amber-400 transition-all duration-200 shadow-md hover:shadow-lg">
              <div className="flex flex-col items-center gap-2 min-w-[80px]">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-bold text-gray-900">{job.time}</span>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`}></div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-bold text-gray-900">{job.client}</span>
                  <Badge className={`${getPriorityColor(job.priority)} text-xs`}>
                    {job.priority}
                  </Badge>
                </div>
                <p className="text-gray-700 font-medium mb-1">{job.service}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{job.location}</span>
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold px-4 py-2 shadow-md"
              >
                View
              </Button>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-6 bg-white border-3 border-blue-300 text-blue-700 hover:bg-blue-50 font-bold py-3 text-lg">
          <Calendar className="h-5 w-5 mr-2" />
          View Full Calendar
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
