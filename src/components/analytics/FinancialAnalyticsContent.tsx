import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  BarChart3
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinancialAnalyticsContent = () => {
  // Mock data for charts
  const dailyRevenueData = [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1800 },
    { day: 'Wed', revenue: 1600 },
    { day: 'Thu', revenue: 2100 },
    { day: 'Fri', revenue: 2400 },
    { day: 'Sat', revenue: 2800 },
    { day: 'Sun', revenue: 2200 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-2">$7,890</div>
            <p className="text-sm text-muted-foreground">This month</p>
            <div className="text-sm text-green-600 mt-1">+15.2% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-blue-500" />
              Avg. Ticket Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-2">$187</div>
            <p className="text-sm text-muted-foreground">Per service</p>
            <div className="text-sm text-blue-600 mt-1">+8.7% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500 mb-2">+24%</div>
            <p className="text-sm text-muted-foreground">Month over month</p>
            <div className="text-sm text-purple-600 mt-1">Above target</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/95 backdrop-blur-md border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Daily Revenue Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle>Top-Earning Service Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Cleaning Services</span>
                <span className="font-bold">$2,890</span>
              </div>
              <div className="flex justify-between">
                <span>Handyman Work</span>
                <span className="font-bold">$2,340</span>
              </div>
              <div className="flex justify-between">
                <span>Plumbing</span>
                <span className="font-bold">$1,560</span>
              </div>
              <div className="flex justify-between">
                <span>Electrical</span>
                <span className="font-bold">$1,100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Credit Card</span>
                <span className="font-bold">65%</span>
              </div>
              <div className="flex justify-between">
                <span>Bank Transfer</span>
                <span className="font-bold">25%</span>
              </div>
              <div className="flex justify-between">
                <span>Cash</span>
                <span className="font-bold">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialAnalyticsContent;