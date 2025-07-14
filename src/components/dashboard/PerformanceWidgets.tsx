import React from 'react';
import { CardToggle } from './TacticalHUD/CardToggle';
import { TrendingUp, DollarSign, Star, Briefcase, Clock, Target, Trophy, Users } from 'lucide-react';

const PerformanceWidgets = () => {
  // Performance widget with multiple views
  const performanceViews = [
    {
      id: 'completion',
      title: 'Completion Rate',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">94%</p>
            <p className="text-sm text-green-600">+2.1%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'efficiency',
      title: 'Efficiency Score',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">87%</p>
            <p className="text-sm text-blue-600">+5.3%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'ontime',
      title: 'On-Time Rate',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">96%</p>
            <p className="text-sm text-green-600">+1.8%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  // Earnings widget with multiple views
  const earningsViews = [
    {
      id: 'today',
      title: 'Today',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$340</p>
            <p className="text-sm text-green-600">+18.2%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'week',
      title: 'This Week',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$2,450</p>
            <p className="text-sm text-green-600">+12.5%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'month',
      title: 'This Month',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$7,890</p>
            <p className="text-sm text-green-600">+15.2%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'avg-ticket',
      title: 'Avg Ticket Value',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">$187</p>
            <p className="text-sm text-blue-600">+8.7%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  // Rating widget with multiple views
  const ratingViews = [
    {
      id: 'average',
      title: 'Average Rating',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">4.8</p>
            <p className="text-sm text-green-600">+0.2</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Star className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'recent',
      title: 'Recent Reviews',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-sm text-blue-600">This week</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'kudos',
      title: 'Kudos Received',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">8</p>
            <p className="text-sm text-green-600">+3 today</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  // Active Jobs widget with multiple views
  const jobsViews = [
    {
      id: 'current',
      title: 'Current Jobs',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-sm text-green-600">+1</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'completed',
      title: 'Completed Today',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">2</p>
            <p className="text-sm text-green-600">On schedule</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'overdue',
      title: 'Overdue',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-sm text-green-600">Perfect!</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <CardToggle
        title="Performance"
        icon={TrendingUp}
        views={performanceViews}
      />
      <CardToggle
        title="Earnings"
        icon={DollarSign}
        views={earningsViews}
        defaultViewIndex={1} // Start with "This Week"
      />
      <CardToggle
        title="Rating"
        icon={Star}
        views={ratingViews}
      />
      <CardToggle
        title="Active Jobs"
        icon={Briefcase}
        views={jobsViews}
      />
    </div>
  );
};

export default PerformanceWidgets;