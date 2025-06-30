
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DraggableTicket from '@/components/manager/DraggableTicket';
import JobOrganizer from '@/components/manager/JobOrganizer';
import RecentFeedback from '@/components/manager/RecentFeedback';
import CrewOverviewHub from '@/components/manager/CrewOverviewHub';

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
  
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [organizedJobs, setOrganizedJobs] = useState<Ticket[]>([]);
  const [isCrewMinimized, setIsCrewMinimized] = useState(false);

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
    <div className="min-h-screen">
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Navigation */}
          <div className="flex items-center mb-6">
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
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Manager</h1>
                <p className="text-white/90 drop-shadow-lg">Operations management and oversight</p>
              </div>
            </div>
          </div>

          {/* Dynamic Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Management - Large Box */}
            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow lg:row-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🎫</span>
                  Ticket Management
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {availableTickets.length} available tickets • Drag to organize
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableTickets.map((ticket) => (
                    <DraggableTicket 
                      key={ticket.id}
                      ticket={ticket}
                      onDragStart={handleDragStart}
                      isDragging={draggedTicket?.id === ticket.id}
                    />
                  ))}
                  {availableTickets.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">✅</div>
                      <p>All tickets have been organized!</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <Button 
                    onClick={() => navigate('/kanban')}
                    className="w-full"
                    variant="outline"
                  >
                    View Full Ticket System
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Organizer - Large Box */}
            <div 
              className="lg:row-span-2"
              onDragLeave={handleDragLeave}
            >
              <JobOrganizer 
                organizedJobs={organizedJobs}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onRemoveJob={handleRemoveJob}
                onReorderJob={handleReorderJob}
                isDragOver={isDragOver}
              />
            </div>

            {/* Calendar - Medium Box */}
            <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📅</span>
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Schedule and appointment management</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Today's Jobs</span>
                    <span className="font-semibold text-blue-600">3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>This Week</span>
                    <span className="font-semibold text-green-600">12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Upcoming</span>
                    <span className="font-semibold text-orange-600">8</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/calendar')}
                  className="w-full"
                >
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Recent Feedback - Medium Box */}
            <RecentFeedback />

            {/* Crew Overview Hub - Can span multiple columns when expanded */}
            <div className={isCrewMinimized ? 'lg:col-span-1' : 'lg:col-span-3'}>
              <CrewOverviewHub 
                isMinimized={isCrewMinimized}
                onToggleMinimize={() => setIsCrewMinimized(!isCrewMinimized)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
