
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleSwitch } from "@/contexts/RoleSwitchContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Clock,
  Navigation,
  Route,
  Zap
} from "lucide-react";
import Header from "@/components/Header";
import ModernServiceCard from "@/components/ModernServiceCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import VideoBackground from "@/components/common/VideoBackground";
import { Service } from "@/types/service";

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user, currentRole]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Mock data for now - in production, this would come from Supabase
      setDashboardData({
        stats: {
          totalBookings: 12,
          activeJobs: 3,
          monthlyRevenue: 2450,
          rating: 4.8,
          optimizedRoutes: 8,
          timesSaved: 45
        },
        recentActivity: [
          { id: 1, type: 'booking', title: 'New plumbing request', time: '2 hours ago' },
          { id: 2, type: 'message', title: 'Message from client', time: '4 hours ago' },
          { id: 3, type: 'payment', title: 'Payment received', time: '1 day ago' }
        ],
        emergencyJobs: [
          { id: 1, title: 'Emergency leak repair', location: 'Downtown', urgency: 'high' },
          { id: 2, title: 'Power outage fix', location: 'Westmount', urgency: 'medium' }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (service: Service) => {
    toast({
      title: "Booking Service",
      description: `Initiating booking for ${service.title}`,
    });
  };

  const services: Service[] = [
    {
      id: "1",
      title: "Home Cleaning",
      description: "Professional cleaning services for your home",
      base_price: 80,
      pricing_type: "hourly",
      category: "cleaning",
      subcategory: "residential",
      active: true,
      background_check_required: false,
      ccq_rbq_required: false,
      risk_category: "low",
      provider: {
        id: "1",
        business_name: "Clean Home Services",
        hourly_rate: 80,
        service_radius_km: 25,
        average_rating: 4.8,
        total_bookings: 150,
        verified: true,
        verification_level: "basic",
        background_check_verified: true,
        ccq_verified: false,
        rbq_verified: false,
        user: {
          full_name: "Sarah Johnson",
          city: "Montreal",
          province: "QC"
        }
      }
    },
    {
      id: "2",
      title: "Plumbing Repair",
      description: "Expert plumbing services and repairs",
      base_price: 120,
      pricing_type: "hourly",
      category: "plumbing",
      subcategory: "repair",
      active: true,
      background_check_required: true,
      ccq_rbq_required: true,
      risk_category: "medium",
      provider: {
        id: "2",
        business_name: "Pro Plumbing Solutions",
        hourly_rate: 120,
        service_radius_km: 30,
        average_rating: 4.9,
        total_bookings: 200,
        verified: true,
        verification_level: "professional_license",
        background_check_verified: true,
        ccq_verified: true,
        rbq_verified: true,
        user: {
          full_name: "Mike Thompson",
          city: "Montreal",
          province: "QC"
        }
      }
    },
    {
      id: "3",
      title: "Electrical Work",
      description: "Safe and reliable electrical services",
      base_price: 150,
      pricing_type: "hourly",
      category: "electrical",
      subcategory: "installation",
      active: true,
      background_check_required: true,
      ccq_rbq_required: true,
      risk_category: "high",
      provider: {
        id: "3",
        business_name: "ElectricPro Montreal",
        hourly_rate: 150,
        service_radius_km: 20,
        average_rating: 4.7,
        total_bookings: 180,
        verified: true,
        verification_level: "professional_license",
        background_check_verified: true,
        ccq_verified: true,
        rbq_verified: true,
        user: {
          full_name: "David Wilson",
          city: "Montreal",
          province: "QC"
        }
      }
    }
  ];

  if (loading) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen">
          <Header />
          <div className="pt-16 px-4 pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-white/20 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/20 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-16 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white text-shadow-lg">
                  {currentRole === 'provider' ? 'Provider Dashboard' : 'Welcome back!'}
                </h1>
                <p className="text-white/90 text-shadow mt-2">
                  {currentRole === 'provider' 
                    ? 'Manage your services and track performance'
                    : 'Find and book services in your area'
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => switchRole(currentRole === 'provider' ? 'customer' : 'provider')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  Switch to {currentRole === 'provider' ? 'Customer' : 'Provider'}
                </Button>
                <Badge className="bg-blue-500/20 text-white border-blue-300/30">
                  {currentRole === 'provider' ? 'Provider Mode' : 'Customer Mode'}
                </Badge>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">
                        {currentRole === 'provider' ? 'Total Bookings' : 'Services Booked'}
                      </p>
                      <p className="text-3xl font-bold">
                        {dashboardData?.stats?.totalBookings || '0'}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">
                        {currentRole === 'provider' ? 'Active Jobs' : 'Pending Requests'}
                      </p>
                      <p className="text-3xl font-bold">
                        {dashboardData?.stats?.activeJobs || '0'}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">
                        {currentRole === 'provider' ? 'Monthly Revenue' : 'Total Spent'}
                      </p>
                      <p className="text-3xl font-bold">
                        ${dashboardData?.stats?.monthlyRevenue || '0'}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80 mb-1">Rating</p>
                      <p className="text-3xl font-bold">
                        {dashboardData?.stats?.rating || '0'}
                      </p>
                    </div>
                    <Star className="h-8 w-8 opacity-70" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* GPS Job Analyzer Preview - Only for Providers */}
            {currentRole === 'provider' && (
              <div className="mb-8">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="h-5 w-5" />
                      GPS Job Analyzer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">
                          {dashboardData?.stats?.optimizedRoutes || '0'}
                        </div>
                        <div className="text-sm opacity-70">Optimized Routes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">
                          {dashboardData?.stats?.timesSaved || '0'} min
                        </div>
                        <div className="text-sm opacity-70">Time Saved Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">
                          {dashboardData?.emergencyJobs?.length || '0'}
                        </div>
                        <div className="text-sm opacity-70">Emergency Jobs</div>
                      </div>
                    </div>
                    
                    {dashboardData?.emergencyJobs && dashboardData.emergencyJobs.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium">Pending Emergency Jobs:</h4>
                        {dashboardData.emergencyJobs.map((job: any) => (
                          <div key={job.id} className="fintech-inner-box flex items-center justify-between p-3">
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm opacity-70">{job.location}</p>
                            </div>
                            <Badge 
                              className={`${
                                job.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {job.urgency}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Link to="/gps-job-analyzer">
                      <Button className="fintech-button-primary w-full">
                        <Route className="h-4 w-4 mr-2" />
                        Open Full Job Analyzer
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData?.recentActivity?.map((activity: any) => (
                        <div key={activity.id} className="fintech-inner-box flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm opacity-70">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <Link to="/bookings">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Bookings
                      </Button>
                    </Link>
                    <Link to="/manager">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Manager Hub
                      </Button>
                    </Link>
                    <Link to="/analytics-dashboard">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Analytics
                      </Button>
                    </Link>
                    <Link to="/services">
                      <Button className="fintech-inner-button w-full flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Browse Services
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services Section for Customers */}
            {currentRole === 'customer' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white text-shadow-lg">Browse Services</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
                      />
                    </div>
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ModernServiceCard 
                      key={service.id} 
                      service={service} 
                      onBookNow={handleBookNow}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedDashboard;
