
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Download, 
  PieChart,
  BarChart3,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
  housie_fee: number;
}

interface ServicePerformance {
  service_name: string;
  total_revenue: number;
  booking_count: number;
  avg_rating: number;
}

const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [servicePerformance, setServicePerformance] = useState<ServicePerformance[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    averageBookingValue: 0,
    housieFeesTotal: 0
  });

  // Mock data for demonstration
  const mockRevenueData: RevenueData[] = [
    { month: 'Jan', revenue: 2500, bookings: 15, housie_fee: 375 },
    { month: 'Feb', revenue: 3200, bookings: 18, housie_fee: 480 },
    { month: 'Mar', revenue: 2800, bookings: 16, housie_fee: 420 },
    { month: 'Apr', revenue: 4100, bookings: 22, housie_fee: 615 },
    { month: 'May', revenue: 3600, bookings: 20, housie_fee: 540 },
    { month: 'Jun', revenue: 4500, bookings: 25, housie_fee: 675 }
  ];

  const mockServiceData: ServicePerformance[] = [
    { service_name: 'Nettoyage résidentiel', total_revenue: 8500, booking_count: 35, avg_rating: 4.8 },
    { service_name: 'Jardinage', total_revenue: 6200, booking_count: 28, avg_rating: 4.6 },
    { service_name: 'Réparations', total_revenue: 4800, booking_count: 18, avg_rating: 4.7 },
    { service_name: 'Peinture', total_revenue: 3200, booking_count: 12, avg_rating: 4.5 }
  ];

  const chartConfig = {
    revenue: {
      label: "Revenus",
      color: "#3B82F6",
    },
    bookings: {
      label: "Réservations",
      color: "#8B5CF6",
    },
    housie_fee: {
      label: "Frais HOUSIE",
      color: "#F59E0B",
    },
  };

  useEffect(() => {
    // Set mock data for now
    setRevenueData(mockRevenueData);
    setServicePerformance(mockServiceData);
    setTotalStats({
      totalRevenue: 20700,
      totalBookings: 116,
      averageBookingValue: 178,
      housieFeesTotal: 3105
    });
    setLoading(false);
  }, [user, timeRange]);

  const exportData = () => {
    const csvData = revenueData.map(item => ({
      Mois: item.month,
      Revenus: `$${item.revenue}`,
      Réservations: item.bookings,
      'Frais HOUSIE': `$${item.housie_fee}`
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `housie-revenue-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Vos données financières ont été exportées pour vos déclarations fiscales.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 fintech-card w-1/3"></div>
              <div className="fintech-stats-grid">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 fintech-card"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Tableau de Bord Financier
              </h1>
              <p className="text-gray-600">Analysez vos revenus et performances</p>
            </div>
            <div className="flex gap-3">
              <div className="flex fintech-card p-1">
                {(['week', 'month', 'year'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={`rounded-xl transition-all duration-200 ${
                      timeRange === range 
                        ? 'fintech-button-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : 'Année'}
                  </Button>
                ))}
              </div>
              <Button
                onClick={exportData}
                className="fintech-button-secondary"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter (Impôts)
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="fintech-stats-grid mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 fintech-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Revenus Totaux</p>
                    <p className="text-2xl font-bold text-white">${totalStats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 fintech-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-100">Réservations</p>
                    <p className="text-2xl font-bold text-white">{totalStats.totalBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 fintech-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-100">Valeur Moyenne</p>
                    <p className="text-2xl font-bold text-white">${totalStats.averageBookingValue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 fintech-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <PieChart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-100">Frais HOUSIE</p>
                    <p className="text-2xl font-bold text-white">${totalStats.housieFeesTotal.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="fintech-chart-container">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Évolution des Revenus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ChartContainer config={chartConfig} className="h-80">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* HOUSIE Fee Breakdown */}
            <Card className="fintech-chart-container">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-orange-600" />
                  Répartition des Revenus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="h-80 flex items-center justify-center">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-blue-600 mb-2">85%</div>
                      <div className="text-sm text-gray-600">Vos Revenus</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 mb-2">15%</div>
                      <div className="text-sm text-gray-600">Frais HOUSIE</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Performance */}
          <Card className="fintech-chart-container">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Services les Plus Performants
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {servicePerformance.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl shadow-inner hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{service.service_name}</h4>
                        <p className="text-sm text-gray-600">{service.booking_count} réservations</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${service.total_revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{service.avg_rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
