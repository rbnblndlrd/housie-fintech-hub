
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
import GPSNavigationMap from '@/components/map/GPSNavigationMap';
import PokemonGOJobMap from '@/components/map/PokemonGOJobMap';
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
import { AnnetteIntegration } from '@/components/assistant/AnnetteIntegration';


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

  // Click outside handler for column chooser
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.column-chooser-container')) {
        setShowColumnChooser(false);
      }
    };

    if (showColumnChooser) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColumnChooser]);

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
        return 'bg-red-600 text-white';
      case 'In Progress':
        return 'bg-blue-600 text-white';
      case 'Confirmed':
        return 'bg-green-600 text-white';
      case 'Scheduled':
        return 'bg-purple-600 text-white';
      case 'Pending':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-slate-600 text-white';
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
                  { id: 'job-hub', label: 'Dashboard', emoji: '🏠' },
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
        <div className={activeTab === 'map' 
          ? "mt-[200px] mx-2 mb-2 md:mx-[280px] md:mr-4 md:mb-4" 
          : "mt-[280px] mx-4 mb-20 md:mx-[280px] md:mr-8 md:mb-8"
        }>
          <Tabs value={activeTab} onValueChange={setActiveTab} className={activeTab === 'map' ? "" : "space-y-5"}>

                <TabsContent value="job-hub" className="space-y-8">
                  {/* Mobile Dashboard - Dynamic Job Icon Grid */}
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

                  {/* Desktop Dashboard - Full Layout with Widgets */}
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
                              className="text-muted-foreground hover:text-foreground relative column-chooser-container"
                              onClick={() => setShowColumnChooser(!showColumnChooser)}
                            >
                              <Settings className="h-4 w-4" />
                              {showColumnChooser && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                  <div className="p-3 space-y-2">
                                    <div className="font-semibold text-sm mb-2">Show Columns</div>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.title}
                                        disabled
                                        className="rounded"
                                      />
                                      Title (required)
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.dueDate}
                                        onChange={(e) => setVisibleColumns(prev => ({...prev, dueDate: e.target.checked}))}
                                        className="rounded"
                                      />
                                      Due Date
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.customer}
                                        onChange={(e) => setVisibleColumns(prev => ({...prev, customer: e.target.checked}))}
                                        className="rounded"
                                      />
                                      Customer
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.priority}
                                        onChange={(e) => setVisibleColumns(prev => ({...prev, priority: e.target.checked}))}
                                        className="rounded"
                                      />
                                      Priority
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={visibleColumns.status}
                                        onChange={(e) => setVisibleColumns(prev => ({...prev, status: e.target.checked}))}
                                        className="rounded"
                                      />
                                      Status
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
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

                      {/* Enhanced Today's Route with integrated drag & drop */}
                      <Card className="fintech-card">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold">Today's Route</CardTitle>
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                                <Zap className="h-3 w-3 mr-1" />
                                🎯 Optimize
                              </Button>
                              <Button size="sm" variant="outline" className="border-orange-300 hover:bg-orange-50">
                                💬 Ask Claude
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Drag & Drop Zone */}
                          <div 
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors min-h-[140px] flex flex-col items-center justify-center ${
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
                              ⚡ DRAG TO REORDER ⚡
                            </p>
                            <p className="text-xs text-gray-500 mb-2">
                              {organizedJobs.length === 0 
                                ? '🎯 Drag jobs here to optimize route' 
                                : `${organizedJobs.length} jobs in optimization queue`
                              }
                            </p>
                            
                            {/* Display organized jobs */}
                            {organizedJobs.length > 0 && (
                              <div className="w-full space-y-2 mt-3">
                                {organizedJobs.slice(0, 3).map((job, index) => (
                                  <div key={job.id} className="flex items-center gap-2 p-2 bg-white rounded border text-left">
                                    <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full text-xs font-bold text-orange-600">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-medium text-gray-800 truncate">
                                        📍 {job.scheduledTime} - {job.customerName}
                                      </div>
                                      <div className="text-xs text-gray-600 truncate">
                                        {job.title}
                                      </div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                      onClick={() => removeJobFromRoute(job.id)}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                                {organizedJobs.length > 3 && (
                                  <div className="text-xs text-gray-500 text-center">
                                    +{organizedJobs.length - 3} more jobs
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Default route items when no organized jobs */}
                            {organizedJobs.length === 0 && (
                              <div className="w-full space-y-2 mt-3">
                                {[
                                  { time: '9:00 AM', customer: 'Johnson', service: 'Furnace' },
                                  { time: '11:30 AM', customer: 'Stevens', service: 'Kitchen repair' }
                                ].map((job, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border text-left">
                                    <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full text-xs font-bold text-green-600">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-medium text-gray-800">
                                        📍 {job.time} - {job.customer}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {job.service}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <div className="text-xs text-orange-600 font-medium mt-2">
                                  ➕ Drop jobs here to add to route
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Link to="/interactive-map" className="w-full">
                              <Button className="w-full h-10 text-sm font-semibold bg-orange-600 hover:bg-orange-700">
                                <MapPin className="h-4 w-4 mr-2" />
                                🗺️ View Full Route
                              </Button>
                            </Link>
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" className="text-sm border-orange-300 hover:bg-orange-50">
                                <Navigation className="h-3 w-3 mr-1" />
                                Start GPS
                              </Button>
                              <Button variant="outline" className="text-sm border-orange-300 hover:bg-orange-50">
                                <ClipboardList className="h-3 w-3 mr-1" />
                                View Bookings
                              </Button>
                            </div>
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

                    {/* Job Execution Mode - Only show when a job is selected */}
                    {executionMode && getSelectedJob() && (
                      <div className="absolute" style={{ left: '620px', top: '320px', width: '500px', height: '400px' }}>
                        <Card className="h-full w-full bg-white border border-gray-200 shadow-lg">
                          <JobExecutionMode
                            job={getSelectedJob()!}
                            phases={phases}
                            progressPercentage={getProgressPercentage()}
                            onBack={exitExecutionMode}
                            onCompleteJob={completeJob}
                            onUpdatePhotoRequirement={updatePhotoRequirement}
                          />
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="bookings" className="space-y-5">
                  {/* Mobile Bookings Layout */}
                  <div className="md:hidden space-y-4">
                    {/* Mini Analytics Bar - 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-3 px-4">
                      <Card className="fintech-card">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-600">Revenue</p>
                            <p className="text-lg font-bold text-green-600">$2,450</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="fintech-card">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-600">Pending</p>
                            <p className="text-lg font-bold text-orange-600">3</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="fintech-card">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-600">Confirmed</p>
                            <p className="text-lg font-bold text-blue-600">8</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="fintech-card">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-600">Rating</p>
                            <p className="text-lg font-bold text-yellow-600">4.8⭐</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Compact Calendar Widget */}
                    <div className="px-4">
                      <Card className="fintech-card">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Today's Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-sm text-gray-600">
                            <p className="mb-1">🕘 9:00 AM - Johnson Cleaning</p>
                            <p className="mb-1">🕐 1:00 PM - Smith Repair</p>
                            <p>🕕 5:00 PM - Davis Installation</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Mobile Incoming Requests with Swipeable Cards */}
                    <div className="px-4">
                      <h2 className="text-lg font-bold text-gray-800 mb-4">Incoming Requests</h2>
                      <div className="space-y-3">
                        {recentBookings.filter(booking => booking.status === 'pending').map((booking) => (
                          <Card 
                            key={booking.id} 
                            className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 hover:shadow-md transition-all duration-200"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-800 mb-1">{booking.client}</h3>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-700">{booking.service}</span>
                                    <span className="text-xl font-bold text-green-600">${booking.amount}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{booking.date} • {booking.time}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                                      PENDING
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  size="sm" 
                                  className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-semibold"
                                  onClick={() => {
                                    // Handle accept
                                    console.log('Accept booking:', booking.id);
                                  }}
                                >
                                  ✓ Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1 h-11 border-red-300 text-red-600 hover:bg-red-50 font-semibold"
                                  onClick={() => {
                                    // Handle decline
                                    console.log('Decline booking:', booking.id);
                                  }}
                                >
                                  ✗ Decline
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="px-4 h-11 border-gray-300 text-gray-600 hover:bg-gray-50"
                                  onClick={() => {
                                    // Handle view details
                                    console.log('View details:', booking.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        {/* Confirmed Bookings */}
                        {recentBookings.filter(booking => booking.status === 'confirmed').map((booking) => (
                          <Card 
                            key={booking.id} 
                            className="relative overflow-hidden bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-800 mb-1">{booking.client}</h3>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-700">{booking.service}</span>
                                    <span className="text-xl font-bold text-green-600">${booking.amount}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{booking.date} • {booking.time}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                      CONFIRMED
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  size="sm" 
                                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                  onClick={() => {
                                    // Handle start job
                                    console.log('Start job:', booking.id);
                                  }}
                                >
                                  🚀 Start Job
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="px-4 h-11 border-gray-300 text-gray-600 hover:bg-gray-50"
                                  onClick={() => {
                                    // Handle view details
                                    console.log('View details:', booking.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {/* Completed Bookings */}
                        {recentBookings.filter(booking => booking.status === 'completed').map((booking) => (
                          <Card 
                            key={booking.id} 
                            className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400 opacity-80"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-700 mb-1">{booking.client}</h3>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-600">{booking.service}</span>
                                    <span className="text-xl font-bold text-gray-600">${booking.amount}</span>
                                  </div>
                                  <p className="text-sm text-gray-500 mb-1">{booking.date} • {booking.time}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-gray-100 text-gray-700 text-xs">
                                      COMPLETED
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1 h-11 border-gray-300 text-gray-600 hover:bg-gray-50"
                                  onClick={() => {
                                    // Handle view receipt
                                    console.log('View receipt:', booking.id);
                                  }}
                                >
                                  📄 View Receipt
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="px-4 h-11 border-gray-300 text-gray-600 hover:bg-gray-50"
                                  onClick={() => {
                                    // Handle view details
                                    console.log('View details:', booking.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        {recentBookings.length === 0 && (
                          <Card className="fintech-card">
                            <CardContent className="py-12">
                              <div className="text-center opacity-70">
                                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                                <p className="text-gray-600">New booking requests will appear here</p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>

                    {/* Desktop Bookings Layout */}
                  <div className="hidden md:block space-y-6">
                    {/* Desktop Calendar Widget - Fixed Z-index */}
                    <div className="relative z-20">
                      <FixedCalendar />
                    </div>
                    
                    {/* Desktop Analytics Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <Card 
                        className="fintech-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          // Show revenue breakdown
                          console.log('Revenue breakdown clicked');
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                              <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">This Week's Revenue</p>
                              <p className="text-2xl font-bold text-green-600">$2,450</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className="fintech-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          setFilterPeriod('pending');
                          console.log('Filter to pending requests');
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
                              <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                              <p className="text-2xl font-bold text-orange-600">{pendingRequests.length}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className="fintech-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          setFilterPeriod('confirmed');
                          console.log('Filter to confirmed jobs');
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Confirmed Jobs</p>
                              <p className="text-2xl font-bold text-blue-600">8</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className="fintech-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          console.log('Show rating details');
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Star className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Average Rating</p>
                              <p className="text-2xl font-bold text-yellow-600">4.8 ⭐</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Annette Assistant Widget - positioned below performance stats */}
                    <div className="flex justify-start mb-6">
                      <AnnetteIntegration />
                    </div>

                    {/* Desktop Incoming Requests Table */}
                    <Card className="fintech-card relative z-10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-6 w-6" />
                          Incoming Booking Requests
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-semibold">Customer</TableHead>
                                <TableHead className="font-semibold">Service</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Time</TableHead>
                                <TableHead className="font-semibold">Price</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {recentBookings
                                .filter(booking => filterPeriod === 'pending' ? booking.status === 'pending' :
                                                  filterPeriod === 'confirmed' ? booking.status === 'confirmed' :
                                                  filterPeriod === 'today' ? true : true)
                                .map((booking) => (
                                <TableRow 
                                  key={booking.id} 
                                  className="hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                                >
                                  <TableCell className="font-medium">{booking.client}</TableCell>
                                  <TableCell>{booking.service}</TableCell>
                                  <TableCell>{booking.date}</TableCell>
                                  <TableCell>{booking.time}</TableCell>
                                  <TableCell className="font-semibold text-green-600">${booking.amount}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusBadge(booking.status)}>
                                      {booking.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      {booking.status === 'pending' ? (
                                        <>
                                          <Button 
                                            size="sm" 
                                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              console.log(`Accepting booking ${booking.id}`);
                                              // Update booking status to confirmed
                                            }}
                                          >
                                            Accept
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-xs px-3 py-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (confirm(`Are you sure you want to decline this booking from ${booking.client}?`)) {
                                                console.log(`Declining booking ${booking.id}`);
                                                // Update booking status to declined
                                              }
                                            }}
                                          >
                                            Decline
                                          </Button>
                                        </>
                                      ) : (
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="text-xs px-3 py-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(`Viewing details for booking ${booking.id}`);
                                            // Open booking details modal
                                          }}
                                        >
                                          View Details
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {recentBookings.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center py-8 opacity-70">
                                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No booking requests</p>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

            <TabsContent value="map" className="p-0 h-full">
              <div className="map-container-dashboard border-2 border-border rounded-lg overflow-hidden bg-background shadow-lg">
                <PokemonGOJobMap isDashboard={true} />
              </div>
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
      
      {/* Annette Assistant */}
      <AnnetteIntegration />
    </>
  );
};

export default ProviderDashboard;
