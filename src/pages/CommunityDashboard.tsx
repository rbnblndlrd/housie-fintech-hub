import React, { useState } from 'react';
import CommunityLayout from '@/components/layouts/CommunityLayout';
import ProgressPreviewCards from '@/components/community/ProgressPreviewCards';
import DiscoverContent from '@/components/community/DiscoverContent';
import NetworkContent from '@/components/community/NetworkContent';
import PrestigeContent from '@/components/community/PrestigeContent';
import SocialContent from '@/components/community/SocialContent';
import { CommunityToggleWidgets } from '@/components/dashboard/TacticalHUD/CommunityToggleWidgets';
import { NetworkMapAnchor } from '@/components/dashboard/TacticalHUD/NetworkMapAnchor';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Trophy, 
  Network as NetworkIcon,
  Zap
} from 'lucide-react';
import { AnnetteIntegration } from '@/components/assistant/AnnetteIntegration';
import { StampTrackerWidget } from '@/components/stamps/StampTrackerWidget';
import CommunityEchoesWidget from '@/components/broadcast/CommunityEchoesWidget';
import RecentStampsWall from '@/components/stamps/RecentStampsWall';

const CommunityDashboard = () => {
  const [activeTab, setActiveTab] = useState('discover');

  const handleProgressClick = (type: string) => {
    console.log('Progress clicked:', type);
  };

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
    <>
      <CommunityLayout
        title="Hall of Prestige"
        rightPanelTitle="Community Hub"
        rightPanelContent={
          <div className="space-y-4">
            <ProgressPreviewCards onProgressClick={handleProgressClick} />
            <StampTrackerWidget className="mb-4" />
            <RecentStampsWall limit={5} />
            <CommunityEchoesWidget limit={8} showControls={true} />
          </div>
        }
        bottomWidgets={<CommunityToggleWidgets />}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderTabContent()}
      </CommunityLayout>
      
      {/* Tactical HUD Anchor Card */}
      <NetworkMapAnchor />
      
      {/* Annette Assistant */}
      <AnnetteIntegration />
    </>
  );
};

export default CommunityDashboard;