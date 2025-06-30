
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Zap, 
  Users, 
  BarChart3, 
  Plus,
  Filter,
  Search,
  Bell,
  Settings,
  Calendar,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react';
import VideoBackground from '@/components/common/VideoBackground';
import DraggableTicket from '@/components/manager/DraggableTicket';
import EnhancedJobOrganizer from '@/components/manager/EnhancedJobOrganizer';
import IncomingJobRequests from '@/components/manager/IncomingJobRequests';
import EnhancedCrewHub from '@/components/manager/EnhancedCrewHub';
import InsightsPerformance from '@/components/manager/InsightsPerformance';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  client: string;
  location: string;
  estimatedDuration: number;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  tags: string[];
  createdAt: string;
}

const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [organizedJobs, setOrganizedJobs] = useState<Ticket[]>([]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const sampleTickets: Ticket[] = [
    {
      id: '1',
      title: 'Emergency Plumbing Repair',
      description: 'Burst pipe in basement - urgent repair needed',
      priority: 'high',
      assignee: 'Marc Dubois',
      client: 'Marie Tremblay',
      location: 'Downtown Montreal',
      estimatedDuration: 120,
      status: 'todo',
      tags: ['plumbing', 'emergency'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'HVAC Maintenance',
      description: 'Regular maintenance check for heating system',
      priority: 'medium',
      assignee: 'Sophie Lavoie',
      client: 'Jean Martin',
      location: 'Westmount',
      estimatedDuration: 90,
      status: 'in-progress',
      tags: ['hvac', 'maintenance'],
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Electrical Safety Check',
      description: 'Inspect electrical panel and wiring',
      priority: 'medium',
      assignee: 'Pierre Gagnon',
      client: 'Claire Dubois',
      location: 'Plateau Mont-Royal',
      estimatedDuration: 60,
      status: 'review',
      tags: ['electrical', 'inspection'],
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      title: 'Bathroom Plumbing Fix',
      description: 'Leaky faucet and running toilet repair',
      priority: 'medium',
      assignee: 'Marc Dubois',
      client: 'Robert Chen',
      location: 'NDG',
      estimatedDuration: 75,
      status: 'todo',
      tags: ['plumbing', 'bathroom'],
      createdAt: '2024-01-11'
    },
    {
      id: '5',
      title: 'Kitchen Renovation Consultation',
      description: 'Initial consultation for kitchen renovation project',
      priority: 'low',
      assignee: 'Luc Bouchard',
      client: 'Nathalie Roy',
      location: 'Verdun',
      estimatedDuration: 45,
      status: 'done',
      tags: ['renovation', 'consultation'],
      createdAt: '2024-01-12'
    }
  ];

  const availableTickets = sampleTickets.filter(
    ticket => !organizedJobs.find(job => job.id === ticket.id)
  );

  const handleDragStart = (e: React.DragEvent, ticket: Ticket) => {
    setDraggedTicket(ticket);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (draggedTicket) {
      setOrganizedJobs(prev => [...prev, draggedTicket]);
      setDraggedTicket(null);
    }
  };

  const handleRemoveJob = (jobId: string) => {
    setOrganizedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleReorderJob = (jobId: string, direction: 'up' | 'down') => {
    setOrganizedJobs(prev => {
      const currentIndex = prev.findIndex(job => job.id === jobId);
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newOrder = [...prev];
      [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
      return newOrder;
    });
  };

  return (
    <>
      {/* Video Background */}
      <VideoBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Modern Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-white/20 flex items-center gap-2 drop-shadow-lg"
                >
                  <ArrowLeft className="h-4 w-4 drop-shadow-md" />
                  <span className="drop-shadow-md">Back</span>
                </Button>
                <div>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg text-shadow-lg">
                    Manager Hub
                  </h1>
                  <p className="text-white/90 mt-1 drop-shadow-md text-shadow">Streamline your operations with intelligent automation</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm drop-shadow-lg">
                  <Bell className="h-4 w-4 drop-shadow-sm" />
                  <Badge variant="destructive" className="h-5 w-5 p-0 text-xs drop-shadow-sm">3</Badge>
                </Button>
                <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm drop-shadow-lg">
                  <Settings className="h-4 w-4 drop-shadow-sm" />
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 drop-shadow-lg">
                  <Plus className="h-4 w-4 mr-2 drop-shadow-sm" />
                  <span className="drop-shadow-sm">Quick Action</span>
                </Button>
              </div>
            </div>

            {/* Quick Stats Cards - Enhanced readability */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-black/20 backdrop-blur-sm text-white border-white/20 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm drop-shadow-md font-medium">Active Jobs</p>
                      <p className="text-2xl font-bold drop-shadow-lg text-shadow-lg">{organizedJobs.length}</p>
                    </div>
                    <Zap className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/20 backdrop-blur-sm text-white border-white/20 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm drop-shadow-md font-medium">Crew Online</p>
                      <p className="text-2xl font-bold drop-shadow-lg text-shadow-lg">3</p>
                    </div>
                    <Users className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/20 backdrop-blur-sm text-white border-white/20 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm drop-shadow-md font-medium">Revenue Today</p>
                      <p className="text-2xl font-bold drop-shadow-lg text-shadow-lg">$2,450</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/20 backdrop-blur-sm text-white border-white/20 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm drop-shadow-md font-medium">Efficiency</p>
                      <p className="text-2xl font-bold drop-shadow-lg text-shadow-lg">94%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-white/80 drop-shadow-md" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs - Enhanced readability */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm p-2 rounded-xl border border-white/20">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white drop-shadow-md"
                >
                  <Zap className="h-4 w-4 drop-shadow-sm" />
                  <span className="drop-shadow-sm">Job Management</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="crew" 
                  className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white drop-shadow-md"
                >
                  <Users className="h-4 w-4 drop-shadow-sm" />
                  <span className="drop-shadow-sm">Crew Hub</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white drop-shadow-md"
                >
                  <BarChart3 className="h-4 w-4 drop-shadow-sm" />
                  <span className="drop-shadow-sm">Insights</span>
                </TabsTrigger>
              </TabsList>

              {/* Job Management Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Ticket Pool - Enhanced readability */}
                  <Card className="bg-black/10 backdrop-blur-sm border-white/20 shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-blue-400 rounded-full drop-shadow-sm"></div>
                          <span className="drop-shadow-md text-shadow">Ticket Pool</span>
                        </div>
                        <Badge variant="secondary" className="bg-white/30 text-white border-white/20 drop-shadow-md">{availableTickets.length}</Badge>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 drop-shadow-md">
                          <Filter className="h-3 w-3 drop-shadow-sm" />
                          <span className="drop-shadow-sm">Filter</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 drop-shadow-md">
                          <Search className="h-3 w-3 drop-shadow-sm" />
                          <span className="drop-shadow-sm">Search</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                      {availableTickets.map((ticket) => (
                        <DraggableTicket 
                          key={ticket.id}
                          ticket={ticket}
                          onDragStart={handleDragStart}
                          isDragging={draggedTicket?.id === ticket.id}
                        />
                      ))}
                      {availableTickets.length === 0 && (
                        <div className="text-center py-8 text-white/80">
                          <div className="text-4xl mb-2 drop-shadow-md">✨</div>
                          <p className="text-sm drop-shadow-md text-shadow">All tickets organized!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Smart Job Organizer */}
                  <div className="xl:col-span-2" onDragLeave={handleDragLeave}>
                    <EnhancedJobOrganizer 
                      organizedJobs={organizedJobs}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onRemoveJob={handleRemoveJob}
                      onReorderJob={handleReorderJob}
                      isDragOver={isDragOver}
                    />
                  </div>
                </div>
                
                {/* Incoming Requests */}
                <Card className="bg-black/10 backdrop-blur-sm border-white/20 shadow-xl">
                  <CardContent className="p-6">
                    <IncomingJobRequests />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Crew Hub Tab */}
              <TabsContent value="crew">
                <Card className="bg-black/10 backdrop-blur-sm border-white/20 shadow-xl">
                  <CardContent className="p-6">
                    <EnhancedCrewHub />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights">
                <Card className="bg-black/10 backdrop-blur-sm border-white/20 shadow-xl">
                  <CardContent className="p-6">
                    <InsightsPerformance />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;
