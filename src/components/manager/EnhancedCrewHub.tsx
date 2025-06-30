
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Briefcase,
  Send
} from 'lucide-react';

const EnhancedCrewHub: React.FC = () => {
  const [chatMessage, setChatMessage] = useState('');

  const crewMembers = [
    { 
      id: '1', 
      name: 'Marc Dubois', 
      role: 'Lead Plumber', 
      status: 'active', 
      location: 'Downtown Montreal',
      currentJob: 'Emergency Repair - Burst Pipe',
      avatar: null,
      skills: ['Plumbing', 'Emergency Repairs'],
      rating: 4.8,
      jobsCompleted: 156
    },
    { 
      id: '2', 
      name: 'Sophie Lavoie', 
      role: 'HVAC Specialist', 
      status: 'available', 
      location: 'Westmount',
      currentJob: null,
      avatar: null,
      skills: ['HVAC', 'Maintenance'],
      rating: 4.9,
      jobsCompleted: 203
    },
    { 
      id: '3', 
      name: 'Pierre Gagnon', 
      role: 'Electrician', 
      status: 'busy', 
      location: 'Plateau Mont-Royal',
      currentJob: 'Safety Inspection',
      avatar: null,
      skills: ['Electrical', 'Safety'],
      rating: 4.7,
      jobsCompleted: 134
    }
  ];

  const availableJobs = [
    { id: 'job-1', title: 'Bathroom Renovation', location: 'NDG', priority: 'medium', duration: 180 },
    { id: 'job-2', title: 'Kitchen Sink Repair', location: 'Verdun', priority: 'high', duration: 90 },
    { id: 'job-3', title: 'Electrical Panel Check', location: 'Westmount', priority: 'low', duration: 60 }
  ];

  const chatMessages = [
    { id: 1, sender: 'Marc Dubois', message: 'Job completed successfully! Customer was very satisfied.', time: '2 min ago', avatar: 'MD' },
    { id: 2, sender: 'Sophie Lavoie', message: 'Heading to next location now. ETA 15 minutes.', time: '5 min ago', avatar: 'SL' },
    { id: 3, sender: 'Pierre Gagnon', message: 'Need additional materials for the electrical work. Can someone bring them?', time: '8 min ago', avatar: 'PG' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'available': return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case 'busy': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'offline': return <AlertTriangle className="h-3 w-3 text-gray-500" />;
      default: return <CheckCircle className="h-3 w-3 text-gray-500" />;
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  const handleAssignJob = (jobId: string, crewMemberId: string) => {
    console.log('Assigning job', jobId, 'to crew member', crewMemberId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Crew Management Hub</h3>
        <Badge className="bg-blue-100 text-blue-800">
          {crewMembers.length} crew members
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Job Board</TabsTrigger>
          <TabsTrigger value="chat">Team Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crewMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar || undefined} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <Badge className={`${getStatusColor(member.status)} text-xs mt-1`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(member.status)}
                          {member.status}
                        </div>
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{member.location}</span>
                    </div>
                    {member.currentJob && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{member.currentJob}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Rating: ⭐ {member.rating}</span>
                      <span>{member.jobsCompleted} jobs</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Available Jobs</h4>
              <div className="space-y-3">
                {availableJobs.map((job) => (
                  <Card key={job.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-sm">{job.title}</h5>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{job.location}</span>
                            <Clock className="h-3 w-3" />
                            <span>{job.duration}min</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {job.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Quick Assign</h4>
              <div className="space-y-2">
                {crewMembers.filter(m => m.status === 'available').map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Assign Job
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
            <div className="space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{msg.sender}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message to the team..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCrewHub;
