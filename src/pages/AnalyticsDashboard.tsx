import React, { useState } from 'react';
import AnalyticsLayout from '@/components/layouts/AnalyticsLayout';
import { AnalyticsToggleWidgets } from '@/components/dashboard/TacticalHUD/AnalyticsToggleWidgets';
import { RevenueSparklineAnchor } from '@/components/dashboard/TacticalHUD/RevenueSparklineAnchor';
import FinancialAnalyticsContent from '@/components/analytics/FinancialAnalyticsContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Brain,
  TrendingUp, 
  Receipt,
  DollarSign,
  Users,
  Clock,
  Star,
  Target,
  Download,
  Calendar,
  PieChart as PieChartIcon,
  Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { AnnetteIntegration } from '@/components/assistant/AnnetteIntegration';
import { RevolverMenu } from '@/components/chat/RevolverMenu';
import { StampTrackerWidget } from '@/components/stamps/StampTrackerWidget';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('financial');

  // Mock data for charts
  const serviceDistributionData = [
    { name: 'Cleaning', value: 35, color: '#8B5CF6' },
    { name: 'Handyman', value: 25, color: '#06B6D4' },
    { name: 'Plumbing', value: 20, color: '#10B981' },
    { name: 'Electrical', value: 12, color: '#F59E0B' },
    { name: 'Other', value: 8, color: '#EF4444' }
  ];

  const monthlyBookingData = [
    { month: 'Jan', bookings: 45 },
    { month: 'Feb', bookings: 52 },
    { month: 'Mar', bookings: 48 },
    { month: 'Apr', bookings: 61 },
    { month: 'May', bookings: 55 },
    { month: 'Jun', bookings: 67 }
  ];

  // Financial Analytics Tab Content (Using imported component)
  const renderFinancialContent = () => <FinancialAnalyticsContent />;

  // Business Insights Tab Content - updated to avoid conflict
  const BusinessInsightsContent = () => (
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
            <div className="text-center text-muted-foreground">Chart would go here</div>
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

  // Performance Metrics Tab Content
  const PerformanceMetricsContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-green-500" />
              On-time Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">96.2%</div>
            <p className="text-sm text-muted-foreground">Excellent performance</p>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              Avg. Time on Site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">2.3h</div>
            <p className="text-sm text-muted-foreground">Per service call</p>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-red-500" />
              Cancel Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">3.1%</div>
            <p className="text-sm text-muted-foreground">Below industry avg</p>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              Customer Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">4.8</div>
            <p className="text-sm text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/95 backdrop-blur-md border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Achievement Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="text-lg font-bold">Technomancer</h3>
              <p className="text-muted-foreground">Elite tier provider with advanced technical skills</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              Level 8
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle>Response Time Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Initial Response</span>
                <span className="font-bold">&lt; 5 min</span>
              </div>
              <div className="flex justify-between">
                <span>Job Acceptance</span>
                <span className="font-bold">&lt; 15 min</span>
              </div>
              <div className="flex justify-between">
                <span>On-site Arrival</span>
                <span className="font-bold">94% on-time</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>First-time Fix Rate</span>
                <span className="font-bold">89%</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Satisfaction</span>
                <span className="font-bold">4.8/5</span>
              </div>
              <div className="flex justify-between">
                <span>Repeat Bookings</span>
                <span className="font-bold">68%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Tax Reports Tab Content
  const TaxReportsContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
              YTD Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-2">$47,890</div>
            <p className="text-sm text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="h-5 w-5 text-blue-500" />
              Deductible Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-2">$8,450</div>
            <p className="text-sm text-muted-foreground">Equipment, travel, etc.</p>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-orange-500" />
              Estimated Taxes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500 mb-2">$11,835</div>
            <p className="text-sm text-muted-foreground">Approximate amount owed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/95 backdrop-blur-md border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Service Tax Breakdown by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Cleaning Services</span>
              <div className="text-right">
                <div className="font-bold">$2,890 (14.975% HST)</div>
                <div className="text-sm text-muted-foreground">$433 HST collected</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Handyman Services</span>
              <div className="text-right">
                <div className="font-bold">$2,340 (14.975% HST)</div>
                <div className="text-sm text-muted-foreground">$350 HST collected</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Plumbing Services</span>
              <div className="text-right">
                <div className="font-bold">$1,560 (14.975% HST)</div>
                <div className="text-sm text-muted-foreground">$234 HST collected</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download PDF Summary
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Tax Documents
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle>Tax Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Q1 HST Filing</span>
                <Badge variant="outline">Due Apr 30</Badge>
              </div>
              <div className="flex justify-between">
                <span>Income Tax Return</span>
                <Badge variant="outline">Due Jun 15</Badge>
              </div>
              <div className="flex justify-between">
                <span>Q2 HST Filing</span>
                <Badge variant="outline">Due Jul 31</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Main content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'financial':
        return renderFinancialContent();
      case 'business':
        return <BusinessInsightsContent />;
      case 'performance':
        return <PerformanceMetricsContent />;
      case 'tax':
        return <TaxReportsContent />;
      default:
        return renderFinancialContent();
    }
  };

  const rightPanelContent = (
    <div className="space-y-4">
      <StampTrackerWidget className="mb-4" />
      <Card className="bg-card/95 backdrop-blur-md border-border/20">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Target className="h-4 w-4 mr-2" />
            Set Goals
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <AnalyticsLayout 
        title="Analytics Dashboard"
        rightPanelTitle="Analytics Tools"
        rightPanelContent={rightPanelContent}
        bottomWidgets={<AnalyticsToggleWidgets />}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderTabContent()}
      </AnalyticsLayout>
      
      {/* Tactical HUD Anchor Card */}
      <RevenueSparklineAnchor />
      
      {/* Annette Assistant */}
      <AnnetteIntegration />
      
      {/* Working Radial Revolver */}
      <div className="fixed bottom-6 right-6 z-50">
        <RevolverMenu />
      </div>
    </>
  );
};

export default AnalyticsDashboard;