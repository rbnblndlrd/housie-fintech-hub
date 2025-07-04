
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoBackground from '@/components/common/VideoBackground';
import FixedCalendar from '@/components/layout/FixedCalendar';
import DraggableWidget from '@/components/dashboard/DraggableWidget';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useRouteOptimizer } from '@/hooks/useRouteOptimizer';
import JobExecutionMode from '@/components/route-optimizer/JobExecutionMode';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  Users, 
  Clock, 
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Eye,
  Briefcase,
  Map,
  UserCog,
  Bell,
  Filter,
  ChevronDown,
  Navigation,
  Route,
  BarChart3,
  Activity,
  Zap,
  ArrowRight,
  Edit,
  Save,
  RotateCcw,
  ClipboardList,
  Settings,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import SimpleNavigation from '@/components/dashboard/SimpleNavigation';
import JobDetailView from '@/components/dashboard/JobDetailView';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('job-hub');
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [filterPeriod, setFilterPeriod] = useState('today');
  
  
  const {
    widgets,
    isEditMode,
    setIsEditMode,
    updateWidgetPosition,
    updateWidgetSize,
    toggleWidgetLock,
    lockAllWidgets,
    unlockAllWidgets,
    resetLayout,
    getWidgetConfig
  } = useDashboardLayout();
  
  const {
    executionMode,
    phases,
    routeJobs,
    organizedJobs,
    selectJob,
    exitExecutionMode,
    updatePhotoRequirement,
    completeJob,
    getSelectedJob,
    getProgressPercentage,
    getTotalRouteStats,
    addJobToRoute,
    removeJobFromRoute
  } = useRouteOptimizer();

  const [dragOver, setDragOver] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  
  // Ticket Management State
  const [showTicketSplitView, setShowTicketSplitView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [sortColumn, setSortColumn] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showColumnChooser, setShowColumnChooser] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('ticketTableColumns');
    return saved ? JSON.parse(saved) : {
      title: true,
      dueDate: true,
      customer: true,
      priority: true,
      status: true,
      actions: true
    };
  });

  // Save column preferences to localStorage
  useEffect(() => {
    localStorage.setItem('ticketTableColumns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Sample Ticket Data
  const tickets = [
    {
      id: 1,
      title: 'Johnson Furnace #127',
      dueDate: 'Jan 15',
      customer: 'Mrs. Johnson',
      priority: 'High',
      status: 'In Progress',
      rawDetails: {
        customerInfo: 'Mrs. Johnson\n123 Main St, Westmount\n(514) 555-0123',
        history: 'Previous visit on Dec 20th - replaced filter\nCustomer called about strange noise',
        notes: 'Furnace making grinding noise, customer concerned about safety'
      },
      aiAnalysis: {
        whatTried: 'Previous filter replacement, basic inspection completed',
        nextSteps: '1. Check blower motor bearings\n2. Inspect heat exchanger\n3. Test safety controls',
        customerReminders: 'Remind customer about annual maintenance schedule'
      }
    },
    {
      id: 2,
      title: 'Smith Plumbing #132',
      dueDate: 'Jan 16',
      customer: 'John Smith',
      priority: 'Medium',
      status: 'Confirmed',
      rawDetails: {
        customerInfo: 'John Smith\n456 Oak Ave, Montreal\n(514) 555-0456',
        history: 'New customer - kitchen sink backup reported',
        notes: 'Kitchen sink draining slowly, possible clog in main line'
      },
      aiAnalysis: {
        whatTried: 'Initial phone diagnosis completed',
        nextSteps: '1. Snake kitchen drain\n2. Check garbage disposal\n3. Inspect main line',
        customerReminders: 'Ask about other slow drains in house'
      }
    },
    {
      id: 3,
      title: 'Chen Electrical #145',
      dueDate: 'Jan 17',
      customer: 'Mike Chen',
      priority: 'Low',
      status: 'Pending',
      rawDetails: {
        customerInfo: 'Mike Chen\n789 Pine St, Plateau\n(514) 555-0789',
        history: 'Outlet replacement requested in home office',
        notes: 'Customer wants USB outlets installed for home office setup'
      },
      aiAnalysis: {
        whatTried: 'Quote provided, awaiting customer approval',
        nextSteps: '1. Confirm outlet specifications\n2. Schedule installation\n3. Test all circuits',
        customerReminders: 'Follow up on quote approval'
      }
    },
    {
      id: 4,
      title: 'Wilson HVAC #156',
      dueDate: 'Jan 18',
      customer: 'Robert Wilson',
      priority: 'High',
      status: 'Emergency',
      rawDetails: {
        customerInfo: 'Robert Wilson\n321 Elm Dr, Outremont\n(514) 555-0321',
        history: 'Emergency call - no heat, family with young children',
        notes: 'System completely down, outside temperature -15°C'
      },
      aiAnalysis: {
        whatTried: 'Emergency response scheduled',
        nextSteps: '1. Check thermostat\n2. Inspect ignition system\n3. Test gas supply',
        customerReminders: 'Priority service due to emergency nature'
      }
    },
    {
      id: 5,
      title: 'Brown Kitchen #163',
      dueDate: 'Jan 19',
      customer: 'Sarah Brown',
      priority: 'Medium',
      status: 'Scheduled',
      rawDetails: {
        customerInfo: 'Sarah Brown\n654 Maple Ave, NDG\n(514) 555-0654',
        history: 'Kitchen renovation - appliance installation needed',
        notes: 'New dishwasher and garbage disposal installation'
      },
      aiAnalysis: {
        whatTried: 'Site visit completed, measurements taken',
        nextSteps: '1. Install dishwasher connections\n2. Wire garbage disposal\n3. Test all connections',
        customerReminders: 'Confirm appliance delivery date'
      }
    },
    {
      id: 6,
      title: 'Garcia Bathroom #178',
      dueDate: 'Jan 20',
      customer: 'Maria Garcia',
      priority: 'Low',
      status: 'Pending',
      rawDetails: {
        customerInfo: 'Maria Garcia\n987 Oak St, Verdun\n(514) 555-0987',
        history: 'Bathroom faucet replacement requested',
        notes: 'Customer wants modern fixture, provided style preferences'
      },
      aiAnalysis: {
        whatTried: 'Product recommendations provided',
        nextSteps: '1. Order selected fixture\n2. Schedule installation\n3. Remove old faucet',
        customerReminders: 'Confirm fixture selection and color'
      }
    }
  ];

  const handleTicketParse = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowTicketSplitView(true);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 font-semibold';
      case 'Medium':
        return 'text-orange-600 font-semibold';
      case 'Low':
        return 'text-green-600 font-semibold';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Emergency':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Sample data
  const recentBookings = [
    {
      id: 1,
      service: "House Cleaning",
      client: "Sarah Johnson",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "Downtown Montreal",
      status: "confirmed",
      amount: 120
    },
    {
      id: 2,
      service: "Plumbing Repair",
      client: "John Smith",
      date: "2024-01-18",
      time: "02:00 PM",
      location: "Westmount",
      status: "pending",
      amount: 85
    },
    {
      id: 3,
      service: "Electrical Installation",
      client: "Emily Clark",
      date: "2024-01-22",
      time: "11:30 AM",
      location: "Plateau",
      status: "confirmed",
      amount: 150
    },
    {
      id: 4,
      service: "Landscaping",
      client: "Michael Davis",
      date: "2024-01-25",
      time: "09:00 AM",
      location: "Outremont",
      status: "completed",
      amount: 200
    },
    {
      id: 5,
      service: "Pet Grooming",
      client: "Linda Wilson",
      date: "2024-01-29",
      time: "03:45 PM",
      location: "Hampstead",
      status: "confirmed",
      amount: 60
    }
  ];

  const pendingRequests = recentBookings.filter(booking => booking.status === 'pending');
  const todaysEarnings = 350;
  const completedJobs = 4;
  const activeRouteProgress = "3 of 5 stops completed";

  const recentActivity = [
    { type: 'booking', message: 'New booking request from Maria Garcia', time: '5 min ago' },
    { type: 'payment', message: 'Payment received: $120.00', time: '15 min ago' },
    { type: 'review', message: 'New 5-star review from John Smith', time: '1 hour ago' },
    { type: 'booking', message: 'Booking confirmed with Lisa Chen', time: '2 hours ago' }
  ];

  const handleJobSelection = (jobId: number) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'secondary',
      'confirmed': 'default',
      'completed': 'outline'
    } as const;
    return variants[status as keyof typeof variants] || 'secondary';
  };

  return (
    <>
      <VideoBackground />
      

      {/* Draggable Welcome Text - Desktop Only */}
      <div className="hidden md:block fixed top-0 left-0 z-40">
        <DraggableWidget
          id="welcome-text"
          defaultPosition={getWidgetConfig('welcome-text').position}
          defaultSize={getWidgetConfig('welcome-text').size}
          isLocked={getWidgetConfig('welcome-text').isLocked}
          showCard={false}
          onPositionChange={updateWidgetPosition}
          onSizeChange={updateWidgetSize}
          onLockToggle={toggleWidgetLock}
        >
          <div className="h-full w-full flex items-center justify-center text-center pointer-events-none">
            <p className="text-white/90 drop-shadow-md">
              Welcome back! Here&apos;s your performance overview
            </p>
          </div>
        </DraggableWidget>
      </div>
      
      <div className="relative z-10 min-h-screen">
        <div className="pb-2">
          <div className="max-w-full">

            {/* Dashboard Controls */}
            <div className="fixed top-4 right-4 z-30 flex gap-2">
              <Button
                onClick={() => setIsEditMode(!isEditMode)}
                variant={isEditMode ? "default" : "outline"}
                className="fintech-card"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditMode ? 'Exit Edit' : 'Edit Layout'}
              </Button>
              
              {isEditMode && (
                <>
                  <Button
                    onClick={lockAllWidgets}
                    variant="outline"
                    className="fintech-card"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lock All
                  </Button>
                  <Button
                    onClick={resetLayout}
                    variant="outline"
                    className="fintech-card"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </>
              )}
            </div>

            {/* Simple Navigation - Left Side - Desktop Only */}
            <div className="hidden md:block fixed top-80 left-12 z-40 w-52">
              <SimpleNavigation 
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Bottom Tab Bar - Mobile Only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
              <div className="flex items-center justify-around py-2">
                {[
                  { id: 'job-hub', label: 'Job Hub', emoji: '🏠' },
                  { id: 'bookings', label: 'Bookings', emoji: '📅' },
                  { id: 'map', label: 'Map', emoji: '🗺️' },
                  { id: 'messages', label: 'Assistant', emoji: '💬' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-lg">{tab.emoji}</span>
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Tabs - Responsive spacing */}
            <div className="mt-[280px] mx-4 mb-20 md:mx-[280px] md:mr-8 md:mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">

                <TabsContent value="job-hub" className="space-y-8">
                  {/* Mobile Job Hub - Dynamic Job Icon Grid */}
                  <div className="md:hidden space-y-4">
                    <div className="px-4 py-2">
                      <h1 className="text-xl font-bold text-white/90 drop-shadow-md mb-2">Welcome back!</h1>
                      <h2 className="text-3xl font-bold text-gray-800">Today's Route</h2>
                    </div>
                    
                    {/* Dynamic Job Icon Grid */}
                    <div className="px-4">
                      <div className="grid grid-cols-3 gap-4 justify-items-center">
                        {[
                          { 
                            time: '9:00 AM', 
                            service: 'Johnson Furnace (return visit)',
                            customer: 'Johnson',
                            phone: '(514) 555-0123',
                            address: '123 Main St, Westmount',
                            status: 'Confirmed',
                            icon: '🔧',
                            type: 'Furnace'
                          },
                          { 
                            time: '11:30 AM', 
                            service: 'New customer - Kitchen repair',
                            customer: 'Stevens',
                            phone: '(514) 555-0456',
                            address: '456 Oak Ave, Montreal',
                            status: 'Pending',
                            icon: '🏠',
                            type: 'Kitchen'
                          },
                          { 
                            time: '2:00 PM', 
                            service: 'Smith Plumbing (follow-up)',
                            customer: 'Smith',
                            phone: '(514) 555-0789',
                            address: '789 Pine St, Plateau',
                            status: 'Confirmed',
                            icon: '🚿',
                            type: 'Plumbing'
                          },
                          { 
                            time: '4:30 PM', 
                            service: 'Emergency call - Heating issue',
                            customer: 'Davis',
                            phone: '(514) 555-0321',
                            address: '321 Elm Dr, Outremont',
                            status: 'Emergency',
                            icon: '🔥',
                            type: 'Emergency'
                          },
                          { 
                            time: '6:00 PM', 
                            service: 'Wilson HVAC - Maintenance',
                            customer: 'Wilson',
                            phone: '(514) 555-0654',
                            address: '654 Maple Ave, NDG',
                            status: 'Confirmed',
                            icon: '❄️',
                            type: 'HVAC'
                          },
                          { 
                            time: '7:30 PM', 
                            service: 'Garcia Electrical - Install',
                            customer: 'Garcia',
                            phone: '(514) 555-0987',
                            address: '987 Oak St, Verdun',
                            status: 'Pending',
                            icon: '⚡',
                            type: 'Electric'
                          }
                        ].map((job, index) => (
                          <div 
                            key={index} 
                            className="flex flex-col items-center space-y-1 cursor-pointer"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowJobDetail(true);
                            }}
                          >
                            {/* Circular Job Icon */}
                            <div 
                              className={`w-[60px] h-[60px] rounded-full flex items-center justify-center text-xl font-bold border-4 bg-white shadow-lg ${
                                job.status === 'Emergency' ? 'border-red-500' :
                                job.status === 'Confirmed' ? 'border-green-500' :
                                'border-yellow-500'
                              }`}
                            >
                              {job.icon}
                            </div>
                            
                            {/* Job Type */}
                            <div className="text-xs font-semibold text-gray-800 text-center">
                              {job.type}
                            </div>
                            
                            {/* Time */}
                            <div className="text-xs font-bold text-gray-700">
                              {job.time}
                            </div>
                            
                            {/* Customer Name (truncated) */}
                            <div className="text-xs text-gray-600 text-center max-w-[70px] truncate">
                              {job.customer}...
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3 px-4 pb-6">
                      <Button className="w-full h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700">
                        <MapPin className="h-5 w-5 mr-2" />
                        🗺️ View Full Route
                      </Button>
                    </div>
                  </div>

                  {/* Desktop Job Hub - Full Layout with Widgets */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Professional Ticket Management Table */}
                      <Card className="fintech-card lg:col-span-2 h-[600px]">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center justify-between text-xl">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-6 w-6" />
                              All Active Tickets
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground relative"
                              onClick={() => setShowColumnChooser(!showColumnChooser)}
                            >
                              <Settings className="h-4 w-4" />
                              {showColumnChooser && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                  <div className="p-3 space-y-2">
                                    <div className="font-semibold text-sm mb-2">Show Columns</div>
                                    <label className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.title}
                                        disabled
                                        className="rounded"
                                      />
                                      Title (required)
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.dueDate}
                                        onChange={(e) => setVisibleColumns(prev => ({...prev, dueDate: e.target.checked}))}
                                        className="rounded"
                                      />
                                      Due Date
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.customer}
                                        onChange={(e) => setVisibleColumns(prev => ({...prev, customer: e.target.checked}))}
                                        className="rounded"
                                      />
                                      Customer
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.priority}
                                        onChange={(e) => setVisibleColumns(prev => ({...prev, priority: e.target.checked}))}
                                        className="rounded"
                                      />
                                      Priority
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.status}
                                        onChange={(e) => setVisibleColumns(prev => ({...prev, status: e.target.checked}))}
                                        className="rounded"
                                      />
                                      Status
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.actions}
                                        disabled
                                        className="rounded"
                                      />
                                      Actions (required)
                                    </label>
                                  </div>
                                </div>
                              )}
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-full pb-6">
                          {!showTicketSplitView ? (
                            <div className="h-full">
                              <div className="p-3 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5 mb-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                  <span>🤖 Quick Parse: Drop ticket here for AI summary</span>
                                </div>
                              </div>
                              
                              <div className="h-[480px] overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      {visibleColumns.title && (
                                        <TableHead 
                                          className="cursor-pointer hover:bg-muted/50 font-semibold"
                                          onClick={() => handleSort('title')}
                                        >
                                          <div className="flex items-center gap-1">
                                            Title
                                            {sortColumn === 'title' && (
                                              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                                            )}
                                          </div>
                                        </TableHead>
                                      )}
                                      {visibleColumns.dueDate && (
                                        <TableHead 
                                          className="cursor-pointer hover:bg-muted/50 font-semibold"
                                          onClick={() => handleSort('dueDate')}
                                        >
                                          <div className="flex items-center gap-1">
                                            Due Date
                                            {sortColumn === 'dueDate' && (
                                              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                                            )}
                                          </div>
                                        </TableHead>
                                      )}
                                      {visibleColumns.customer && (
                                        <TableHead 
                                          className="cursor-pointer hover:bg-muted/50 font-semibold"
                                          onClick={() => handleSort('customer')}
                                        >
                                          <div className="flex items-center gap-1">
                                            Customer
                                            {sortColumn === 'customer' && (
                                              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                                            )}
                                          </div>
                                        </TableHead>
                                      )}
                                      {visibleColumns.priority && (
                                        <TableHead 
                                          className="cursor-pointer hover:bg-muted/50 font-semibold"
                                          onClick={() => handleSort('priority')}
                                        >
                                          <div className="flex items-center gap-1">
                                            Priority
                                            {sortColumn === 'priority' && (
                                              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                                            )}
                                          </div>
                                        </TableHead>
                                      )}
                                      {visibleColumns.status && (
                                        <TableHead 
                                          className="cursor-pointer hover:bg-muted/50 font-semibold"
                                          onClick={() => handleSort('status')}
                                        >
                                          <div className="flex items-center gap-1">
                                            Status
                                            {sortColumn === 'status' && (
                                              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                                            )}
                                          </div>
                                        </TableHead>
                                      )}
                                      {visibleColumns.actions && (
                                        <TableHead className="font-semibold">Actions</TableHead>
                                      )}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                     {tickets.map((ticket) => (
                                       <TableRow key={ticket.id} className="hover:bg-muted/30">
                                         {visibleColumns.title && <TableCell className="font-medium">{ticket.title}</TableCell>}
                                         {visibleColumns.dueDate && <TableCell>{ticket.dueDate}</TableCell>}
                                         {visibleColumns.customer && <TableCell>{ticket.customer}</TableCell>}
                                         {visibleColumns.priority && (
                                           <TableCell className={getPriorityColor(ticket.priority)}>
                                             {ticket.priority}
                                           </TableCell>
                                         )}
                                         {visibleColumns.status && (
                                           <TableCell>
                                             <Badge className={getStatusColor(ticket.status)}>
                                               {ticket.status}
                                             </Badge>
                                           </TableCell>
                                         )}
                                         {visibleColumns.actions && (
                                           <TableCell>
                                             <div className="flex gap-2">
                                               <Button 
                                                 size="sm" 
                                                 variant="outline" 
                                                 className="text-xs px-3 py-2 font-medium"
                                                 onClick={() => handleTicketParse(ticket)}
                                               >
                                                 Parse
                                               </Button>
                                               <Button 
                                                 size="sm" 
                                                 variant="outline" 
                                                 className="text-xs px-3 py-2 font-medium"
                                               >
                                                 Schedule
                                               </Button>
                                             </div>
                                           </TableCell>
                                         )}
                                       </TableRow>
                                     ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          ) : (
                            /* Split View Layout */
                            <div className="h-full flex flex-col">
                              <div className="flex items-center gap-2 mb-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowTicketSplitView(false)}
                                  className="hover:bg-muted"
                                >
                                  <ArrowLeft className="h-4 w-4 mr-2" />
                                  Back to List
                                </Button>
                                <div className="text-lg font-semibold">{selectedTicket?.title}</div>
                              </div>
                              
                              <div className="flex-1 grid grid-cols-2 gap-4 h-full">
                                {/* Left Panel - Raw Ticket Details */}
                                <Card className="bg-muted/20">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Raw Ticket Details</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2">Customer Info</h4>
                                      <pre className="text-xs bg-background p-3 rounded border whitespace-pre-wrap">
                                        {selectedTicket?.rawDetails.customerInfo}
                                      </pre>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2">History</h4>
                                      <pre className="text-xs bg-background p-3 rounded border whitespace-pre-wrap">
                                        {selectedTicket?.rawDetails.history}
                                      </pre>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2">Notes</h4>
                                      <pre className="text-xs bg-background p-3 rounded border whitespace-pre-wrap">
                                        {selectedTicket?.rawDetails.notes}
                                      </pre>
                                    </div>
                                  </CardContent>
                                </Card>
                                
                                {/* Right Panel - AI Analysis */}
                                <Card className="bg-blue-50/50">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base text-blue-800">AI Analysis Results</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2 text-blue-700">What You Tried</h4>
                                      <pre className="text-xs bg-white p-3 rounded border whitespace-pre-wrap">
                                        {selectedTicket?.aiAnalysis.whatTried}
                                      </pre>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2 text-blue-700">Next Steps</h4>
                                      <pre className="text-xs bg-white p-3 rounded border whitespace-pre-wrap">
                                        {selectedTicket?.aiAnalysis.nextSteps}
                                      </pre>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2 text-blue-700">Customer Reminders</h4>
                                      <pre className="text-xs bg-white p-3 rounded border whitespace-pre-wrap">
                                        {selectedTicket?.aiAnalysis.customerReminders}
                                      </pre>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Desktop Today's Route */}
                      <Card className="fintech-card">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold">Today's Route</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            {[
                              { 
                                time: '9:00 AM', 
                                service: 'Johnson Furnace (return visit)',
                                customer: 'Mrs. Johnson',
                                phone: '(514) 555-0123',
                                address: '123 Main St, Westmount',
                                status: 'Confirmed'
                              },
                              { 
                                time: '11:30 AM', 
                                service: 'New customer - Kitchen repair',
                                customer: 'Mike Stevens',
                                phone: '(514) 555-0456',
                                address: '456 Oak Ave, Montreal',
                                status: 'Pending'
                              }
                            ].map((job, index) => (
                              <div 
                                key={index} 
                                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setShowJobDetail(true);
                                }}
                              >
                                <div className="text-sm font-bold text-gray-800 mb-1">
                                  🕘 {job.time}
                                </div>
                                <div className="text-sm font-semibold text-gray-700 mb-1">
                                  {job.service}
                                </div>
                                <div className="text-xs text-gray-600 mb-1">
                                  {job.customer}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    className={
                                      job.status === 'Emergency' ? 'bg-red-100 text-red-800' :
                                      job.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }
                                  >
                                    {job.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-3 pt-4">
                            <Button className="w-full h-10 text-sm font-semibold bg-orange-600 hover:bg-orange-700">
                              <MapPin className="h-4 w-4 mr-2" />
                              🗺️ View Full Route
                            </Button>
                            <Button variant="outline" className="w-full h-10 text-sm font-semibold border-orange-300 hover:bg-orange-50">
                              💬 Ask Claude
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Draggable Widget Container for remaining widgets - Desktop Only */}
                  <div className="hidden md:block relative h-[600px] w-full">
                    {/* Performance Widget */}
                    <DraggableWidget
                      id="performance"
                      defaultPosition={getWidgetConfig('performance').position}
                      defaultSize={getWidgetConfig('performance').size}
                      isLocked={getWidgetConfig('performance').isLocked}
                      onPositionChange={updateWidgetPosition}
                      onSizeChange={updateWidgetSize}
                      onLockToggle={toggleWidgetLock}
                    >
                      <CardContent className="p-5">
                        <div className="text-center">
                          <div className="h-12 w-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-orange-800">Performance</h3>
                          <p className="text-sm text-orange-600">Track metrics</p>
                        </div>
                      </CardContent>
                    </DraggableWidget>

                    {/* Earnings Widget */}
                    <DraggableWidget
                      id="earnings"
                      defaultPosition={getWidgetConfig('earnings').position}
                      defaultSize={getWidgetConfig('earnings').size}
                      isLocked={getWidgetConfig('earnings').isLocked}
                      onPositionChange={updateWidgetPosition}
                      onSizeChange={updateWidgetSize}
                      onLockToggle={toggleWidgetLock}
                    >
                      <CardContent className="p-5">
                        <div className="text-center">
                          <div className="h-12 w-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-orange-800">Earnings</h3>
                          <p className="text-sm text-orange-600">$2,450 today</p>
                        </div>
                      </CardContent>
                    </DraggableWidget>

                    {/* Rating Widget */}
                    <DraggableWidget
                      id="rating"
                      defaultPosition={getWidgetConfig('rating').position}
                      defaultSize={getWidgetConfig('rating').size}
                      isLocked={getWidgetConfig('rating').isLocked}
                      onPositionChange={updateWidgetPosition}
                      onSizeChange={updateWidgetSize}
                      onLockToggle={toggleWidgetLock}
                    >
                      <CardContent className="p-5">
                        <div className="text-center">
                          <div className="h-12 w-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <Star className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-orange-800">Rating</h3>
                          <p className="text-sm text-orange-600">4.9 stars</p>
                        </div>
                      </CardContent>
                    </DraggableWidget>

                    {/* Active Jobs Widget */}
                    <DraggableWidget
                      id="active-jobs"
                      defaultPosition={getWidgetConfig('active-jobs').position}
                      defaultSize={getWidgetConfig('active-jobs').size}
                      isLocked={getWidgetConfig('active-jobs').isLocked}
                      onPositionChange={updateWidgetPosition}
                      onSizeChange={updateWidgetSize}
                      onLockToggle={toggleWidgetLock}
                    >
                      <CardContent className="p-5">
                        <div className="text-center">
                          <div className="h-12 w-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-orange-800">Active Jobs</h3>
                          <p className="text-sm text-orange-600">3 pending</p>
                        </div>
                      </CardContent>
                    </DraggableWidget>

                    {/* Smart Route Optimizer Widget - Desktop Only */}
                    <div className="absolute" style={{ left: '620px', top: '320px', width: '500px', height: '400px' }}>
                      <Card className="h-full w-full bg-white border border-gray-200 shadow-lg">
                      {executionMode && getSelectedJob() ? (
                        <JobExecutionMode
                          job={getSelectedJob()!}
                          phases={phases}
                          progressPercentage={getProgressPercentage()}
                          onBack={exitExecutionMode}
                          onCompleteJob={completeJob}
                          onUpdatePhotoRequirement={updatePhotoRequirement}
                        />
                      ) : (
                        <>
                          <CardHeader className="pb-2 px-3 pt-3">
                            <CardTitle className="flex items-center justify-between text-base font-bold">
                              <div className="flex items-center gap-2">
                                <Route className="h-4 w-4" />
                                SMART ROUTE OPTIMIZER
                              </div>
                              <Badge className="bg-orange-500 text-white text-xs">ACTIVE</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 px-3 pb-3">
                            {/* Route Planning Area */}
                            <div 
                              className={`border-2 border-dashed rounded-lg p-4 text-center mb-3 transition-colors min-h-[120px] flex flex-col items-center justify-center ${
                                dragOver ? 'border-blue-400 bg-blue-50' : 'border-orange-300 bg-orange-50/30'
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                              }}
                              onDragLeave={() => setDragOver(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setDragOver(false);
                                const jobId = e.dataTransfer.getData('text/plain');
                                addJobToRoute(jobId);
                              }}
                            >
                              <Route className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                {organizedJobs.length === 0 
                                  ? 'Drag jobs here to optimize route' 
                                  : `${organizedJobs.length} jobs in optimization queue`
                                }
                              </p>
                              <p className="text-xs text-gray-500">
                                AI-powered route planning with real-time traffic analysis
                              </p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="space-y-2">
                              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2">
                                <Route className="h-4 w-4 mr-2" />
                                Optimize Route
                              </Button>
                              <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="text-sm border-orange-300 hover:bg-orange-50">
                                  <Navigation className="h-3 w-3 mr-1" />
                                  Start GPS Navigation
                                </Button>
                                <Link to="/interactive-map" className="w-full">
                                  <Button variant="outline" className="w-full text-sm border-orange-300 hover:bg-orange-50">
                                    <Map className="h-3 w-3 mr-1" />
                                    View Interactive Map
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </>
                      )}
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bookings" className="space-y-5">
                  {/* Fixed Calendar - moved from job-hub */}
                  <FixedCalendar />
                  
                  {/* Pending Bookings Section */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Incoming Pending Bookings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pendingRequests.map((booking) => (
                          <div key={booking.id} className="fintech-inner-box flex items-center justify-between p-4">
                            <div className="flex-1">
                              <h3 className="font-medium">{booking.service}</h3>
                              <p className="text-sm opacity-70">{booking.client} • {booking.date} at {booking.time}</p>
                              <p className="text-sm opacity-60">{booking.location}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold">${booking.amount}</span>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline">
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {pendingRequests.length === 0 && (
                          <div className="text-center py-8 opacity-70">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No pending booking requests</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Booking Analytics Widget */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle>Booking Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{completedJobs}</p>
                          <p className="text-sm opacity-70">Completed Today</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">${todaysEarnings}</p>
                          <p className="text-sm opacity-70">Today's Earnings</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{pendingRequests.length}</p>
                          <p className="text-sm opacity-70">Pending Requests</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="map">
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle>Map View</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="opacity-70">Interactive map will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="messages">
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle>AI Assistant & Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[600px]">
                        <iframe 
                          src="/chat-panel" 
                          className="w-full h-full border-0 rounded-lg"
                          title="Chat Assistant"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Job Detail View */}
      {showJobDetail && selectedJob && (
        <JobDetailView 
          job={selectedJob}
          onBack={() => setShowJobDetail(false)}
        />
      )}
    </>
  );
};

export default ProviderDashboard;
