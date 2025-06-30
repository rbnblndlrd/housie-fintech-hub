
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Minimize2, 
  Maximize2, 
  MessageSquare, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface CrewOverviewHubProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const CrewOverviewHub: React.FC<CrewOverviewHubProps> = ({ 
  isMinimized, 
  onToggleMinimize 
}) => {
  const [activeTab, setActiveTab] = useState('crew');

  const crewMembers = [
    { 
      id: '1', 
      name: 'Marc Dubois', 
      role: 'Lead Plumber', 
      status: 'active', 
      location: 'Downtown Montreal',
      currentJob: 'Emergency Repair - Burst Pipe',
      avatar: null
    },
    { 
      id: '2', 
      name: 'Sophie Lavoie', 
      role: 'HVAC Specialist', 
      status: 'available', 
      location: 'Westmount',
      currentJob: null,
      avatar: null
    },
    { 
      id: '3', 
      name: 'Pierre Gagnon', 
      role: 'Electrician', 
      status: 'busy', 
      location: 'Plateau Mont-Royal',
      currentJob: 'Safety Inspection',
      avatar: null
    }
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

  if (isMinimized) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Crew Hub</span>
              <Badge variant="outline" className="text-xs">
                {crewMembers.length} members
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleMinimize}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex -space-x-2 mt-2">
            {crewMembers.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                <AvatarImage src={member.avatar || undefined} />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Crew Management Hub
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleMinimize}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button 
            variant={activeTab === 'crew' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('crew')}
          >
            Crew Members
          </Button>
          <Button 
            variant={activeTab === 'schedule' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('schedule')}
          >
            Schedule
          </Button>
          <Button 
            variant={activeTab === 'communication' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('communication')}
          >
            Communication
          </Button>
        </div>

        {activeTab === 'crew' && (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {crewMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar || undefined} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <Badge className={`${getStatusColor(member.status)} text-xs`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(member.status)}
                        {member.status}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{member.location}</span>
                    </div>
                    {member.currentJob && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{member.currentJob}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Schedule management coming soon...</p>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Team communication features coming soon...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrewOverviewHub;
