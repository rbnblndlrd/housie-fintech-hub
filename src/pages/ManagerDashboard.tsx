
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  
  const [section1Open, setSection1Open] = useState(true);
  const [section2Open, setSection2Open] = useState(false);
  const [section3Open, setSection3Open] = useState(false);
  
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
    <div className="min-h-screen">
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Manager Command Center</h1>
                <p className="text-white/90 drop-shadow-lg">Complete operational control and automation</p>
              </div>
            </div>
          </div>

          {/* Section 1: Job Management & Automation Hub */}
          <Collapsible open={section1Open} onOpenChange={setSection1Open} className="mb-6">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-6 h-auto bg-white/95 backdrop-blur-sm hover:bg-white/90 transition-colors border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-gray-900">Job Management & Automation Hub</h2>
                    <p className="text-gray-600">Smart ticket management, routing, and incoming requests</p>
                  </div>
                </div>
                {section1Open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg border p-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Ticket Management */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      🎫 Ticket Management
                      <span className="text-sm font-normal text-gray-600">
                        ({availableTickets.length} available)
                      </span>
                    </h3>
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
                          <p>All tickets organized!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Job Organizer */}
                  <div 
                    className="xl:col-span-2"
                    onDragLeave={handleDragLeave}
                  >
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
                
                {/* Incoming Job Requests */}
                <div className="mt-8 border-t pt-6">
                  <IncomingJobRequests />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Section 2: Crew Management Hub */}
          <Collapsible open={section2Open} onOpenChange={setSection2Open} className="mb-6">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-6 h-auto bg-white/95 backdrop-blur-sm hover:bg-white/90 transition-colors border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-gray-900">Crew Management Hub</h2>
                    <p className="text-gray-600">Team coordination, job board, and communication</p>
                  </div>
                </div>
                {section2Open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg border p-6">
                <EnhancedCrewHub />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Section 3: Insights & Performance */}
          <Collapsible open={section3Open} onOpenChange={setSection3Open} className="mb-6">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-6 h-auto bg-white/95 backdrop-blur-sm hover:bg-white/90 transition-colors border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-gray-900">Insights & Performance</h2>
                    <p className="text-gray-600">Feedback, calendar preview, and achievement progress</p>
                  </div>
                </div>
                {section3Open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg border p-6">
                <InsightsPerformance />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
