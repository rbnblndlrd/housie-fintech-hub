import React from 'react';
import { CardToggle } from './CardToggle';
import { DollarSign, Target, TrendingUp, Calendar, BarChart3, PieChart } from 'lucide-react';

export const AnalyticsToggleWidgets = () => {
  // Total Earnings widget with multiple views
  const earningsViews = [
    {
      id: 'current',
      title: 'Current Month',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$7,890</p>
            <p className="text-sm text-green-600">+15.2% from last month</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'previous',
      title: 'Previous Month',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$6,850</p>
            <p className="text-sm text-blue-600">May results</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'average',
      title: '6-Month Average',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$6,240</p>
            <p className="text-sm text-purple-600">Trending up</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  // Avg Ticket Value widget with multiple views
  const ticketViews = [
    {
      id: 'current',
      title: 'Current Avg',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$187</p>
            <p className="text-sm text-green-600">+8.7% improvement</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'highest',
      title: 'Highest Service',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$450</p>
            <p className="text-sm text-blue-600">Electrical work</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'target',
      title: 'Target Goal',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$200</p>
            <p className="text-sm text-green-600">93.5% achieved</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  // Growth Rate widget with multiple views
  const growthViews = [
    {
      id: 'monthly',
      title: 'Month over Month',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">+24%</p>
            <p className="text-sm text-green-600">Above target</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'yearly',
      title: 'Year over Year',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">+156%</p>
            <p className="text-sm text-green-600">Exceptional growth</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'quarterly',
      title: 'Quarterly Trend',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">+67%</p>
            <p className="text-sm text-blue-600">Q2 performance</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  // Top Services widget with multiple views
  const servicesViews = [
    {
      id: 'top5',
      title: 'Top 5 Services',
      content: (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Cleaning</span>
            <span className="font-bold">$2,890</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Handyman</span>
            <span className="font-bold">$2,340</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Plumbing</span>
            <span className="font-bold">$1,560</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Electrical</span>
            <span className="font-bold">$1,100</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Painting</span>
            <span className="font-bold">$890</span>
          </div>
        </div>
      )
    },
    {
      id: 'top10',
      title: 'Top 10 Services',
      content: (
        <div className="space-y-1">
          {[
            'Cleaning - $2,890',
            'Handyman - $2,340', 
            'Plumbing - $1,560',
            'Electrical - $1,100',
            'Painting - $890',
            'Landscaping - $720',
            'Carpentry - $650',
            'HVAC - $580',
            'Appliance - $420',
            'Other - $340'
          ].map((service, i) => (
            <div key={i} className="text-xs flex justify-between">
              <span>{service.split(' - ')[0]}</span>
              <span className="font-medium">{service.split(' - ')[1]}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'growth',
      title: 'Fastest Growing',
      content: (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>HVAC</span>
            <span className="font-bold text-green-600">+45%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Electrical</span>
            <span className="font-bold text-green-600">+32%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Plumbing</span>
            <span className="font-bold text-green-600">+28%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Painting</span>
            <span className="font-bold text-green-600">+21%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cleaning</span>
            <span className="font-bold text-green-600">+15%</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <CardToggle
        title="Total Earnings"
        icon={DollarSign}
        views={earningsViews}
      />
      <CardToggle
        title="Avg Ticket Value"
        icon={Target}
        views={ticketViews}
      />
      <CardToggle
        title="Growth Rate"
        icon={TrendingUp}
        views={growthViews}
      />
      <CardToggle
        title="Top Services"
        icon={PieChart}
        views={servicesViews}
        className="xl:col-span-1"
      />
    </div>
  );
};