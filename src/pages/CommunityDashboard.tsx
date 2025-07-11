import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CommunityNavigation from '@/components/dashboard/CommunityNavigation';
import ProgressPreviewCards from '@/components/community/ProgressPreviewCards';
import DiscoverContent from '@/components/community/DiscoverContent';
import NetworkContent from '@/components/community/NetworkContent';
import PrestigeContent from '@/components/community/PrestigeContent';
import SocialContent from '@/components/community/SocialContent';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Trophy, 
  Network as NetworkIcon,
  Zap
} from 'lucide-react';

const CommunityDashboard = () => {
  const [activeTab, setActiveTab] = useState('discover');

  const handleProgressClick = (type: string) => {
    console.log('Progress clicked:', type);
  };
  
  const communityStats = [
    {
      title: "Network Connections",
      value: "127",
      change: "+23",
      icon: Users,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Community Points", 
      value: "2,450",
      change: "+180",
      icon: Trophy,
      color: "from-yellow-600 to-orange-600"
    },
    {
      title: "Memberships",
      value: "3", 
      change: "+1",
      icon: NetworkIcon,
      color: "from-purple-600 to-violet-600"
    },
    {
      title: "Current Rank",
      value: "Technomancer ⚡",
      change: "+3 levels", 
      icon: Zap,
      color: "from-green-600 to-emerald-600"
    }
  ];


  // Community-specific bottom widgets
  const communityWidgets = (
    <>
      {communityStats.map((stat, index) => (
        <Card 
          key={index} 
          className="bg-card/95 backdrop-blur-md border-border/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );

  // Tab navigation content
  const tabNavigation = (
    <CommunityNavigation 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
    />
  );

  // Main content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverContent />;
      case 'network':
        return <NetworkContent />;
      case 'recognition':
        return <PrestigeContent />;
      case 'social':
        return <SocialContent />;
      default:
        return <DiscoverContent />;
    }
  };

  return (
    <DashboardLayout
      title="Hall of Prestige"
      rightPanelTitle="Community Hub"
      rightPanelContent={
        <div className="space-y-4">
          <ProgressPreviewCards onProgressClick={handleProgressClick} />
        </div>
      }
      bottomWidgets={communityWidgets}
    >
      <div className="space-y-6">
        {tabNavigation}
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
};

export default CommunityDashboard;