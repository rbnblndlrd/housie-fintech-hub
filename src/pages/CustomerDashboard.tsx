import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import DraggableWidget from '@/components/dashboard/DraggableWidget';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  Calendar, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Search,
  Filter,
  Edit,
  Save,
  RotateCcw,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SharedDashboardOverlay } from '@/components/shared/SharedDashboardOverlay';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings();
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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Calculate stats from real booking data
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalSpent = bookings
    .filter(b => b.total_amount)
    .reduce((sum, b) => sum + (b.total_amount || 0), 0);
  
  // Get recent completed bookings with ratings (for now, mock the ratings)
  const recentCompletedBookings = bookings
    .filter(b => b.status === 'completed')
    .slice(0, 5)
    .map(booking => ({
      ...booking,
      rating: Math.floor(Math.random() * 2) + 4 // Mock rating 4-5 stars
    }));

  const avgRating = recentCompletedBookings.length > 0
    ? (recentCompletedBookings.reduce((sum, b) => sum + b.rating, 0) / recentCompletedBookings.length).toFixed(1)
    : '0.0';

  const hasBookings = bookings.length > 0;

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        

        <div className="pt-16 pl-[188px] pr-[188px] pb-8">
          <div className="max-w-full">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                  Welcome Back!
                </h1>
                <p className="text-white/90 text-shadow">
                  {hasBookings ? 'Manage your services and bookings' : 'Start by booking your first service'}
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/services">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Book Service
                  </Button>
                </Link>
                <Link to="/calendar">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    View Calendar
                  </Button>
                </Link>
              </div>
            </div>

            {/* Draggable Dashboard Container */}
            <div className="relative h-[1000px] w-full mb-8">
              {/* Total Bookings Widget */}
              <DraggableWidget
                id="total-bookings"
                defaultPosition={getWidgetConfig('performance').position}
                defaultSize={getWidgetConfig('performance').size}
                isLocked={getWidgetConfig('performance').isLocked}
                onPositionChange={updateWidgetPosition}
                onSizeChange={updateWidgetSize}
                onLockToggle={toggleWidgetLock}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Total Bookings</p>
                      <p className="text-3xl font-bold">{totalBookings}</p>
                    </div>
                    <Calendar className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </DraggableWidget>

              {/* Pending Widget */}
              <DraggableWidget
                id="pending"
                defaultPosition={getWidgetConfig('earnings').position}
                defaultSize={getWidgetConfig('earnings').size}
                isLocked={getWidgetConfig('earnings').isLocked}
                onPositionChange={updateWidgetPosition}
                onSizeChange={updateWidgetSize}
                onLockToggle={toggleWidgetLock}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Pending</p>
                      <p className="text-3xl font-bold">{pendingBookings}</p>
                    </div>
                    <Clock className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </DraggableWidget>

              {/* Total Spent Widget */}
              <DraggableWidget
                id="total-spent"
                defaultPosition={getWidgetConfig('rating').position}
                defaultSize={getWidgetConfig('rating').size}
                isLocked={getWidgetConfig('rating').isLocked}
                onPositionChange={updateWidgetPosition}
                onSizeChange={updateWidgetSize}
                onLockToggle={toggleWidgetLock}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Total Spent</p>
                      <p className="text-3xl font-bold">${totalSpent.toFixed(0)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </DraggableWidget>

              {/* Avg Rating Widget */}
              <DraggableWidget
                id="avg-rating"
                defaultPosition={getWidgetConfig('active-jobs').position}
                defaultSize={getWidgetConfig('active-jobs').size}
                isLocked={getWidgetConfig('active-jobs').isLocked}
                onPositionChange={updateWidgetPosition}
                onSizeChange={updateWidgetSize}
                onLockToggle={toggleWidgetLock}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Avg Rating Given</p>
                      <p className="text-3xl font-bold">{avgRating}</p>
                    </div>
                    <Star className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </DraggableWidget>

              {/* Recent Bookings Widget */}
              <DraggableWidget
                id="recent-bookings"
                defaultPosition={getWidgetConfig('recent-activity').position}
                defaultSize={getWidgetConfig('recent-activity').size}
                isLocked={getWidgetConfig('recent-activity').isLocked}
                onPositionChange={updateWidgetPosition}
                onSizeChange={updateWidgetSize}
                onLockToggle={toggleWidgetLock}
              >
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-sm text-gray-500">Loading bookings...</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No bookings yet</p>
                      <Link to="/services">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Book Your First Service
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="fintech-inner-box flex items-center justify-between p-4">
                          <div className="flex-1">
                            <h3 className="font-medium">{booking.serviceName}</h3>
                            <p className="text-sm opacity-70">{booking.provider} • {booking.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={booking.status === 'completed' ? 'default' : 'secondary'}
                              className={
                                booking.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </DraggableWidget>

              {/* Quick Actions Widget */}
              <DraggableWidget
                id="quick-actions"
                defaultPosition={getWidgetConfig('route-optimizer').position}
                defaultSize={{ width: 300, height: 350 }}
                isLocked={getWidgetConfig('route-optimizer').isLocked}
                onPositionChange={updateWidgetPosition}
                onSizeChange={updateWidgetSize}
                onLockToggle={toggleWidgetLock}
              >
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link to="/services">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Book New Service
                      </Button>
                    </Link>
                    <Link to="/calendar">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        View Calendar
                      </Button>
                    </Link>
                    <Link to="/bookings">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        My Bookings
                      </Button>
                    </Link>
                    <Button className="fintech-inner-button w-full flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Emergency Services
                    </Button>
                  </div>
                </CardContent>
              </DraggableWidget>

            </div>
          </div>
        </div>
      </div>
      
      {/* Shared Dashboard Overlay - BubbleChat + RevolverMenu */}
      <SharedDashboardOverlay />
    </>
  );
};

export default CustomerDashboard;
