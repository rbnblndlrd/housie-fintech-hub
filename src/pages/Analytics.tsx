
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Eye,
  DollarSign, 
  TrendingUp, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Activity,
  Users
} from 'lucide-react';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Real-time style data
  const [liveStats, setLiveStats] = useState({
    todayRevenue: 425,
    weeklyRevenue: 2840,
    pendingPayments: 3,
    activeBookings: 7,
    completionRate: 94,
    responseTime: '12min'
  });

  const quickActions = [
    { label: "Performance Dashboard", icon: <Activity className="h-5 w-5" />, path: "/performance-dashboard", color: "bg-blue-500" },
    { label: "Business Insights", icon: <Target className="h-5 w-5" />, path: "/business-insights", color: "bg-purple-500" },
    { label: "Tax Reports", icon: <DollarSign className="h-5 w-5" />, path: "/tax-reports", color: "bg-green-500" },
    { label: "Full Analytics", icon: <Eye className="h-5 w-5" />, path: "/analytics-dashboard", color: "bg-orange-500" }
  ];

  const recentActivity = [
    { type: "payment", amount: "$85", time: "2min ago", status: "completed" },
    { type: "booking", service: "Cleaning", time: "15min ago", status: "confirmed" },
    { type: "payment", amount: "$120", time: "1hr ago", status: "pending" },
    { type: "review", rating: "5★", time: "2hr ago", status: "received" }
  ];

  const alerts = [
    { type: "success", message: "Payment of $85 received", time: "2min ago" },
    { type: "warning", message: "Payment of $120 pending review", time: "1hr ago" }
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 50),
        activeBookings: Math.max(1, prev.activeBookings + (Math.random() > 0.7 ? 1 : -1))
      }));
    }, 10000);

    setLoading(false);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-700 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-slate-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={() => navigate('/analytics-dashboard')}
                variant="outline"
                className="bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border-purple-500/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Analytics Hub
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Live Financial Monitor
              </h1>
            </div>
            <p className="text-slate-300">Real-time revenue tracking and quick insights</p>
          </div>

          {/* Live Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm mb-1">Today's Revenue</p>
                    <p className="text-3xl font-bold text-white">${liveStats.todayRevenue}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">+12%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <DollarSign className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm mb-1">Weekly Total</p>
                    <p className="text-3xl font-bold text-white">${liveStats.weeklyRevenue}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">+8%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-800/20 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm mb-1">Active Jobs</p>
                    <p className="text-3xl font-bold text-white">{liveStats.activeBookings}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">Live</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Activity className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600/20 to-red-800/20 border-orange-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-300 text-sm mb-1">Response Time</p>
                    <p className="text-3xl font-bold text-white">{liveStats.responseTime}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4 text-orange-400" />
                      <span className="text-orange-400 text-sm">Avg</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Zap className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => navigate(action.path)}
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 hover:bg-slate-700/50 group"
                  >
                    <div className={`p-2 ${action.color} rounded-lg mr-3 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <span className="text-white font-medium">{action.label}</span>
                    <ArrowUpRight className="h-4 w-4 ml-auto text-slate-400 group-hover:text-white" />
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-400' : 
                        activity.status === 'pending' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {activity.amount || activity.service || activity.rating}
                        </p>
                        <p className="text-slate-400 text-xs">{activity.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        activity.status === 'completed' ? 'border-green-400 text-green-400' : 
                        activity.status === 'pending' ? 'border-yellow-400 text-yellow-400' : 'border-blue-400 text-blue-400'
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alerts & Notifications */}
            <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    alert.type === 'success' ? 'bg-green-900/20 border-green-500/30' : 'bg-yellow-900/20 border-yellow-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      {alert.type === 'success' ? 
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" /> : 
                        <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      }
                      <div>
                        <p className="text-white text-sm font-medium">{alert.message}</p>
                        <p className="text-slate-400 text-xs mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full text-slate-400 hover:text-white hover:bg-slate-700/50"
                  onClick={() => navigate('/notifications')}
                >
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
