
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Home
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  if (!user) {
    navigate('/auth');
    return null;
  }

  const [tickets] = useState<Ticket[]>([
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
    },
    {
      id: '5',
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
      id: '6',
      title: 'Air Conditioning Service',
      description: 'Annual AC maintenance and filter replacement',
      priority: 'low',
      assignee: 'Sophie Lavoie',
      client: 'Linda Martinez',
      location: 'Outremont',
      estimatedDuration: 60,
      status: 'in-progress',
      tags: ['hvac', 'maintenance'],
      createdAt: '2024-01-10'
    }
  ]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Navigation */}
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
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Ticket System</h1>
                <p className="text-white/90 drop-shadow-lg">Manage and organize your service tickets</p>
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/90 backdrop-blur-sm"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <div className="text-white bg-black/20 backdrop-blur-sm rounded-md px-3 py-2 text-center">
              {filteredTickets.length} tickets found
            </div>
          </div>

          {/* Ticket List */}
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                        <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={`${getStatusColor(ticket.status)} text-xs`}>
                          {ticket.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{ticket.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span><strong>Assignee:</strong> {ticket.assignee}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span><strong>Client:</strong> {ticket.client}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span><strong>Location:</strong> {ticket.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span><strong>Duration:</strong> {ticket.estimatedDuration}min</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {ticket.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate('/gps-job-analyzer', { state: { ticket } })}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        GPS
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTickets.length === 0 && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
