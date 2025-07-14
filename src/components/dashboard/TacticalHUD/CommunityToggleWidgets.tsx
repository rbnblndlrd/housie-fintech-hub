import React from 'react';
import { CardToggle } from './CardToggle';
import { Users, Trophy, Network as NetworkIcon, Zap, Star, Target, TrendingUp } from 'lucide-react';

export const CommunityToggleWidgets = () => {
  // Network Connections widget with multiple views
  const networkViews = [
    {
      id: 'total',
      title: 'Total Connections',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">127</p>
            <p className="text-sm text-green-600">+23 this month</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'active',
      title: 'Active This Week',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">47</p>
            <p className="text-sm text-blue-600">High engagement</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'new',
      title: 'New This Month',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">23</p>
            <p className="text-sm text-green-600">Growing network</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  // Community Points widget with multiple views
  const pointsViews = [
    {
      id: 'total',
      title: 'Total Points',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">2,450</p>
            <p className="text-sm text-green-600">+180 this week</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'recent',
      title: 'Recent Earnings',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">180</p>
            <p className="text-sm text-blue-600">This week</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'rank',
      title: 'Community Rank',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">#47</p>
            <p className="text-sm text-green-600">Top 10%</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
            <Star className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  // Memberships widget with multiple views
  const membershipViews = [
    {
      id: 'active',
      title: 'Active Memberships',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-sm text-green-600">+1 new</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
            <NetworkIcon className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'elite',
      title: 'Elite Status',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">Gold</p>
            <p className="text-sm text-yellow-600">Premium tier</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'benefits',
      title: 'Benefits Used',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">8</p>
            <p className="text-sm text-blue-600">This month</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  // Current Rank widget with multiple views
  const rankViews = [
    {
      id: 'current',
      title: 'Current Rank',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">Technomancer ⚡</p>
            <p className="text-sm text-green-600">+3 levels</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'progress',
      title: 'Next Level Progress',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">87%</p>
            <p className="text-sm text-blue-600">To Architect</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'achievements',
      title: 'Achievements',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-sm text-green-600">Unlocked</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <CardToggle
        title="Network Connections"
        icon={Users}
        views={networkViews}
      />
      <CardToggle
        title="Community Points"
        icon={Trophy}
        views={pointsViews}
      />
      <CardToggle
        title="Memberships"
        icon={NetworkIcon}
        views={membershipViews}
      />
      <CardToggle
        title="Current Rank"
        icon={Zap}
        views={rankViews}
      />
    </div>
  );
};