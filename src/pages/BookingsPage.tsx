
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';
import KanbanTicketList from '@/components/dashboard/KanbanTicketList';
import CalendarPreview from '@/components/calendar/CalendarPreview';
import BookingsCalendar from '@/components/bookings/BookingsCalendar';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, CheckCircle, ArrowLeft, List, CalendarDays } from 'lucide-react';
import { UXModeSelector } from '@/components/dashboard/UXModeSelector';
import { UXModeJobCard } from '@/components/dashboard/UXModeJobCard';
import { useUXMode } from '@/hooks/useUXMode';
import BookingsLayoutController from '@/components/dashboard/BookingsLayoutController';
import ServiceLayoutSelector from '@/components/dashboard/ServiceLayoutSelector';
import { useServiceLayout } from '@/hooks/useServiceLayout';
import JobParser from '@/components/shared/JobParser';
import { toast } from 'sonner';

const BookingsPage = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const navigate = useNavigate();
  const { bookings: upcomingBookings, loading, refetch } = useBookings();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Convert bookings to jobs format for service layout detection
  const jobsForServiceLayout = upcomingBookings.map(booking => ({
    id: booking.id,
    title: booking.serviceName,
    service_subcategory: booking.serviceName?.toLowerCase().includes('clean') ? 'cleaning' : 
                        booking.serviceName?.toLowerCase().includes('tattoo') ? 'tattoo' : 'general',
    customer: booking.provider,
    priority: 'medium'
  }));

  const {
    currentLayout,
    layoutDefinition,
    detectedLayout,
    isManualOverride,
    setLayoutOverride,
    availableLayouts
  } = useServiceLayout(jobsForServiceLayout);

  const handleJobAction = (jobId: string, action: string) => {
    console.log(`🎯 Booking action: ${action} for booking ${jobId}`);
    // Handle different actions based on service layout
  };

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-600 text-white';
      case 'pending': return 'bg-amber-600 text-white';
      case 'completed': return 'bg-blue-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        
        {/* Dashboard Navigation - Left Side - Desktop Only */}
        <div className="hidden md:block fixed top-80 left-12 z-40 w-52">
          <DashboardNavigation />
        </div>
        
        <div className="pt-16 pl-[188px] pr-[188px] pb-8 md:pl-[280px]">
          <div className="max-w-full">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/10 flex items-center gap-2 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-7 w-7 text-blue-400" />
                  <h1 className="text-3xl font-bold text-black">
                    {currentRole === 'provider' ? 'Manage Bookings' : 'My Bookings'}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <ServiceLayoutSelector
                    currentLayout={currentLayout}
                    detectedLayout={detectedLayout}
                    isManualOverride={isManualOverride}
                    onLayoutChange={setLayoutOverride}
                    availableLayouts={availableLayouts}
                  />
                  {currentRole === 'provider' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="flex items-center gap-2"
                      >
                        <List className="h-4 w-4" />
                        List View
                      </Button>
                      <Button
                        variant={viewMode === 'calendar' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('calendar')}
                        className="flex items-center gap-2"
                      >
                        <CalendarDays className="h-4 w-4" />
                        Calendar View
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-700">
                {currentRole === 'provider' 
                  ? 'Manage your service requests and track job progress' 
                  : 'View your upcoming appointments and booking history'}
              </p>
            </div>

            {currentRole === 'provider' ? (
              // Provider View - Service Layout Based Interface
              <div className="space-y-6">
                {/* Annette's Contextual Insight with Service Layout */}
                <Card className="fintech-card border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">A</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-purple-700 font-medium mb-1">Annette says:</p>
                        <p className="text-purple-600 text-sm">
                          {layoutDefinition.annetteVoiceLine}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 border-purple-300 text-purple-700 hover:bg-purple-100"
                        >
                          Get Layout Tips
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {viewMode === 'list' ? (
                  <BookingsLayoutController
                    layoutType={currentLayout}
                    bookings={upcomingBookings}
                    loading={loading}
                    onBookingUpdate={refetch}
                  />
                ) : (
                  <BookingsCalendar 
                    bookings={upcomingBookings} 
                    loading={loading}
                    onBookingUpdate={refetch}
                  />
                )}
              </div>
            ) : (
              // Customer View - Simple Bookings List with Calendar using fintech styling
              <div className="space-y-6">
                {/* Annette's Customer Insight */}
                <Card className="fintech-card border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">A</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-purple-700 font-medium mb-1">Annette says:</p>
                        <p className="text-purple-600 text-sm">
                          "Looking good! You have {upcomingBookings.length} upcoming bookings. 
                          Want me to remind you about your next appointment or help you book something new?"
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 border-purple-300 text-purple-700 hover:bg-purple-100"
                        >
                          Ask Annette
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="fintech-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4">
                    {loading ? (
                      <div className="text-center text-gray-500 py-4">Loading bookings...</div>
                    ) : upcomingBookings.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">No bookings found</div>
                    ) : (
                      upcomingBookings.map((booking) => (
                        <div key={booking.id} className="fintech-inner-box p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-black">{booking.serviceName}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {booking.date} at {booking.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {booking.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              {booking.provider}
                            </div>
                            {booking.total_amount && (
                              <div className="text-sm font-medium text-green-600">
                                ${booking.total_amount}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t flex gap-2">
                            <JobParser
                              job={{
                                id: booking.id,
                                service_type: booking.serviceName,
                                customer_name: 'Customer',
                                address: booking.location,
                                priority: 'medium',
                                status: booking.status
                              }}
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            />
                            {booking.status === 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-300 text-purple-700 hover:bg-purple-100"
                                onClick={() => {
                                  // Trigger review flow for customer
                                  toast.success('Review flow coming soon!');
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                    <Card className="fintech-card">
                      <CardContent className="p-0">
                        <CalendarPreview />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* Add Chat Bubble */}
        <ChatBubble />
      </div>
    </>
  );
};

export default BookingsPage;
