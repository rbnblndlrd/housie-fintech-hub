import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, MapPin, Filter, Download, Search, Shield, AlertTriangle, Activity, Wifi } from 'lucide-react';
import Header from '@/components/Header';
import OverviewSection from '@/components/admin/OverviewSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import BookingAnalyticsSection from '@/components/admin/BookingAnalyticsSection';
import FinancialInsightsSection from '@/components/admin/FinancialInsightsSection';
import PlatformHealthSection from '@/components/admin/PlatformHealthSection';
import LiveUsersSection from '@/components/admin/LiveUsersSection';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      <div className="pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  Admin Dashboard
                </h1>
                <p className="text-xl text-gray-600">Centre de contrôle HOUSIE - Vue d'ensemble complète</p>
              </div>
              <div className="flex gap-3">
                <Button className="fintech-button-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter Données
                </Button>
                <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres Avancés
                </Button>
              </div>
            </div>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-6 h-14 fintech-card rounded-2xl">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-200"
              >
                Vue Générale
              </TabsTrigger>
              <TabsTrigger 
                value="live-users" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-200"
              >
                <Wifi className="h-4 w-4 mr-1" />
                Utilisateurs Live
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-200"
              >
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-200"
              >
                Réservations
              </TabsTrigger>
              <TabsTrigger 
                value="financial" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-200"
              >
                Finances
              </TabsTrigger>
              <TabsTrigger 
                value="health" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-200"
              >
                Santé Plateforme
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <OverviewSection />
            </TabsContent>

            <TabsContent value="live-users" className="space-y-8">
              <LiveUsersSection />
            </TabsContent>

            <TabsContent value="users" className="space-y-8">
              <UserManagementSection />
            </TabsContent>

            <TabsContent value="bookings" className="space-y-8">
              <BookingAnalyticsSection />
            </TabsContent>

            <TabsContent value="financial" className="space-y-8">
              <FinancialInsightsSection />
            </TabsContent>

            <TabsContent value="health" className="space-y-8">
              <PlatformHealthSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
