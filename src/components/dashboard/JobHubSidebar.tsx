import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Bot,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface JobHubSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobHubSidebar: React.FC<JobHubSidebarProps> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<'main' | 'parse'>('main');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const sampleTickets = [
    { id: '127', customer: 'Johnson', service: 'Furnace', priority: 'high' },
    { id: '132', customer: 'Smith', service: 'Plumbing', priority: 'medium' },
    { id: '145', customer: 'Chen', service: 'Electrical', priority: 'low' },
    { id: '156', customer: 'Williams', service: 'HVAC', priority: 'high' },
    { id: '163', customer: 'Brown', service: 'Kitchen Repair', priority: 'medium' },
    { id: '178', customer: 'Davis', service: 'Bathroom Remodel', priority: 'low' },
    { id: '189', customer: 'Miller', service: 'Roof Repair', priority: 'high' },
    { id: '195', customer: 'Wilson', service: 'Flooring', priority: 'medium' },
    { id: '204', customer: 'Garcia', service: 'Painting', priority: 'low' },
    { id: '217', customer: 'Martinez', service: 'Landscaping', priority: 'medium' },
    { id: '223', customer: 'Anderson', service: 'Driveway', priority: 'high' },
    { id: '234', customer: 'Taylor', service: 'Fence Install', priority: 'low' }
  ];

  const todaysRoute = [
    { time: '9:00 AM', customer: 'Johnson', service: 'Furnace (return visit)' },
    { time: '11:30 AM', customer: 'New customer', service: 'Kitchen repair' },
    { time: '2:00 PM', customer: 'Smith', service: 'Plumbing (follow-up)' }
  ];

  const handleParseTicket = (ticketId: string, customer: string, service: string) => {
    setSelectedTicket(`${customer} ${service} #${ticketId}`);
    setCurrentView('parse');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedTicket(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[500px] bg-white border-l shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {currentView === 'main' ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-yellow-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  📋 Job Hub
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="hover:bg-white/50"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Ticket Manager Section */}
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  📋 All Active Tickets
                </h3>
                
                {/* Quick Parse Box */}
                <div className="mb-4 p-3 border-2 border-dashed border-orange-200 rounded-lg bg-orange-50/30">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bot className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">🤖 Quick Parse: Drop ticket here for AI summary</span>
                  </div>
                </div>

                {/* Ticket List */}
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {sampleTickets.map((ticket) => (
                      <div 
                        key={ticket.id}
                        className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">
                            • {ticket.customer} {ticket.service} #{ticket.id}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleParseTicket(ticket.id, ticket.customer, ticket.service)}
                            className="text-xs px-2 py-1 h-6"
                          >
                            Parse
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs px-2 py-1 h-6"
                          >
                            Schedule
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Today's Route Section */}
              <div className="p-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  TODAY'S ROUTE
                </h3>
                
                <div className="space-y-3 mb-4">
                  {todaysRoute.map((job, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">
                          • {job.time} - {job.customer}
                        </div>
                        <div className="text-xs text-gray-600">
                          {job.service}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Route on Map
                  </Button>
                  <Button variant="outline" className="w-full border-orange-300 hover:bg-orange-50">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    💬 Ask Annette
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Parse Analysis View */
          <div className="h-full flex flex-col">
            {/* Parse Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToMain}
                  className="hover:bg-white/50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-bold text-gray-800">
                  🤖 AI Analysis
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">{selectedTicket}</p>
            </div>

            {/* Analysis Content */}
            <div className="flex-1 p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    Detailed Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Problem Summary</h4>
                    <p className="text-sm text-gray-600">
                      Customer reports intermittent heating issues with their furnace system. 
                      Initial diagnostics suggest potential thermostat malfunction or ductwork blockage.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Recommended Actions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Check thermostat calibration and battery</li>
                      <li>• Inspect air filter for blockages</li>
                      <li>• Test heating element functionality</li>
                      <li>• Verify proper airflow through vents</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Estimated Time</h4>
                    <p className="text-sm text-gray-600">2-3 hours for complete diagnosis and repair</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Parts Needed</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Thermostat (backup - $75)</li>
                      <li>• Air filter ($15)</li>
                      <li>• Various small components ($25)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JobHubSidebar;