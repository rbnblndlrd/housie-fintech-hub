
import React, { useState } from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Zap, 
  FileText, 
  Settings,
  Bell,
  Search,
  Filter,
  Star,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import TicketDropZone from '@/components/dashboard/TicketDropZone';
import QuickActionsGrid from '@/components/dashboard/QuickActionsGrid';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import GPSMapWidget from '@/components/dashboard/GPSMapWidget';
import DragTicketList from '@/components/dashboard/DragTicketList';

const Dashboard = () => {
  const [draggedTicket, setDraggedTicket] = useState(null);

  const statsData = [
    { 
      title: 'Active Jobs', 
      value: '24', 
      change: '+12%', 
      icon: Zap, 
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Monthly Revenue', 
      value: '$18,450', 
      change: '+8.5%', 
      icon: DollarSign, 
      color: 'from-green-600 to-green-800',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Team Members', 
      value: '12', 
      change: '+2', 
      icon: Users, 
      color: 'from-purple-600 to-purple-800',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Avg Rating', 
      value: '4.9', 
      change: '+0.1', 
      icon: Star, 
      color: 'from-yellow-600 to-yellow-800',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-6 pb-8">
          {/* Full Width Container */}
          <div className="max-w-[98vw] mx-auto">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-5xl font-black text-white text-shadow-xl mb-2">
                  HOUSIE Command Center
                </h1>
                <p className="text-white/90 text-xl text-shadow">
                  Manage your operations with intelligent automation
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                  <Badge className="ml-2 bg-red-500">3</Badge>
                </Button>
                <Button className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-8 py-4 text-lg font-bold shadow-xl border-4 border-amber-300">
                  <Plus className="h-5 w-5 mr-2" />
                  New Job
                </Button>
              </div>
            </div>

            {/* Stats Cards Row - LARGE and WIDE */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <Card key={index} className="autumn-card-fintech-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-700 mb-2">{stat.title}</p>
                        <p className="text-4xl font-black text-gray-900 mb-2">{stat.value}</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-bold">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Dashboard Grid - MAXIMUM WIDTH */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
              {/* Ticket Drop Zone - LARGE and PROMINENT */}
              <div className="xl:col-span-8">
                <TicketDropZone 
                  draggedTicket={draggedTicket}
                  onDrop={() => setDraggedTicket(null)}
                />
              </div>

              {/* Quick Actions - BIG buttons */}
              <div className="xl:col-span-4">
                <QuickActionsGrid />
              </div>
            </div>

            {/* Bottom Row - Calendar and GPS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              {/* Calendar Widget - SUBSTANTIAL size */}
              <CalendarWidget />
              
              {/* GPS Map Widget - WIDE and TALL */}
              <GPSMapWidget />
            </div>

            {/* Drag and Drop Ticket List - FULL WIDTH */}
            <DragTicketList 
              onDragStart={setDraggedTicket}
              draggedTicket={draggedTicket}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
