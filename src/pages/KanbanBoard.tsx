
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import KanbanTicketList from '@/components/dashboard/KanbanTicketList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft,
  Kanban,
  List,
  Grid
} from 'lucide-react';

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

const KanbanBoard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'grid'>('list');

  if (!user) {
    navigate('/auth');
    return null;
  }

  const stats = [
    { label: 'New Requests', value: 8, color: 'bg-blue-500' },
    { label: 'In Progress', value: 12, color: 'bg-yellow-500' },
    { label: 'Completed Today', value: 6, color: 'bg-green-500' },
    { label: 'Total Revenue', value: '$2,450', color: 'bg-purple-500' }
  ];

  const handleAnalyzeJob = (ticket: Ticket) => {
    navigate('/gps', { state: { ticket } });
  };

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-white text-shadow-lg">Service Ticket Management</h1>
                  <p className="text-white/90 text-shadow">Organize and track your service requests</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-3 h-12 ${stat.color} rounded-full`}></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search and View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm w-80"
                  />
                </div>
                
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? '' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className={viewMode === 'kanban' ? '' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
                >
                  <Kanban className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? '' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Content - Autotask Style Ticket List */}
            <div className="space-y-6">
              <KanbanTicketList />
              
              {/* Additional Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Ticket
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-white border-white/20 hover:bg-white/10">
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filters
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-white border-white/20 hover:bg-white/10">
                      <Search className="h-4 w-4 mr-2" />
                      Bulk Operations
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow text-lg">Priority Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-red-100 text-red-800">High</Badge>
                      <span className="text-white">3 tickets</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      <span className="text-white">8 tickets</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800">Low</Badge>
                      <span className="text-white">4 tickets</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-white/90">
                      <p className="font-medium">Plumbing ticket completed</p>
                      <p className="text-white/70">2 minutes ago</p>
                    </div>
                    <div className="text-sm text-white/90">
                      <p className="font-medium">New electrical request</p>
                      <p className="text-white/70">15 minutes ago</p>
                    </div>
                    <div className="text-sm text-white/90">
                      <p className="font-medium">HVAC maintenance scheduled</p>
                      <p className="text-white/70">1 hour ago</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
