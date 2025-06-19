
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  PieChart,
  Calendar,
  DollarSign,
  Target,
  Clock
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();

  const analyticsPages = [
    {
      title: "Performance Dashboard",
      description: "Track your business KPIs and performance metrics",
      icon: <BarChart3 className="h-8 w-8" />,
      path: "/performance-dashboard",
      color: "from-blue-500 to-blue-600",
      stats: "92% Efficiency"
    },
    {
      title: "Business Insights", 
      description: "Comprehensive analytics and business metrics",
      icon: <PieChart className="h-8 w-8" />,
      path: "/business-insights",
      color: "from-purple-500 to-purple-600",
      stats: "$28,750 Revenue"
    },
    {
      title: "Tax Reports & Compliance",
      description: "Tax compliance dashboard and official documents",
      icon: <FileText className="h-8 w-8" />,
      path: "/tax-reports",
      color: "from-green-500 to-emerald-500",
      stats: "$27,000 Income"
    },
    {
      title: "Financial Analytics",
      description: "Revenue analysis and financial reporting",
      icon: <DollarSign className="h-8 w-8" />,
      path: "/analytics",
      color: "from-orange-500 to-orange-600",
      stats: "$20,700 Total"
    }
  ];

  const quickStats = [
    { label: "Total Revenue", value: "$28,750", change: "+12%", icon: <DollarSign className="h-5 w-5" /> },
    { label: "Bookings", value: "127", change: "+8%", icon: <Calendar className="h-5 w-5" /> },
    { label: "Avg. Rate", value: "$35/hr", change: "+5%", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Rating", value: "4.8", change: "+0.2", icon: <Target className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={() => navigate('/analytics')}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
              >
                ← Retour aux Analytiques
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Business Dashboard
            </h1>
            <p className="text-gray-600">Customizable widgets and comprehensive business insights</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="p-2 bg-blue-50 rounded-lg mb-2">
                        {stat.icon}
                      </div>
                      <Badge variant="secondary" className="text-green-700 bg-green-100">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsPages.map((page, index) => (
              <Card 
                key={index} 
                className="fintech-card hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(page.path)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 bg-gradient-to-r ${page.color} rounded-2xl text-white group-hover:scale-110 transition-transform duration-200`}>
                      {page.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{page.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-gray-700">
                          {page.stats}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
