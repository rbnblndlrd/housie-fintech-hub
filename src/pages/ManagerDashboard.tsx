
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
                  className="text-white hover:bg-white/20 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                    Manager Hub
                  </h1>
                  <p className="text-white/90 mt-1 drop-shadow">Streamline your operations with intelligent automation</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Bell className="h-4 w-4" />
                  <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">3</Badge>
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Action
                </Button>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Active Jobs</p>
                      <p className="text-2xl font-bold">{organizedJobs.length}</p>
                    </div>
                    <Zap className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Crew Online</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Users className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Revenue Today</p>
                      <p className="text-2xl font-bold">$2,450</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Efficiency</p>
                      <p className="text-2xl font-bold">94%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/20">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  <Zap className="h-4 w-4" />
                  Job Management
                </TabsTrigger>
                <TabsTrigger 
                  value="crew" 
                  className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4" />
                  Crew Hub
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  <BarChart3 className="h-4 w-4" />
                  Insights
                </TabsTrigger>
              </TabsList>

              {/* Job Management Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Ticket Pool */}
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                          Ticket Pool
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white">{availableTickets.length}</Badge>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
                          <Filter className="h-3 w-3" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
                          <Search className="h-3 w-3" />
                          Search
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
                        <div className="text-center py-8 text-white/70">
                          <div className="text-4xl mb-2">✨</div>
                          <p className="text-sm">All tickets organized!</p>
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
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                  <CardContent className="p-6">
                    <IncomingJobRequests />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Crew Hub Tab */}
              <TabsContent value="crew">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                  <CardContent className="p-6">
                    <EnhancedCrewHub />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
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
