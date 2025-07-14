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
import { BroadcastDashboardPanel } from '@/components/stamps/BroadcastDashboardPanel';
import { CanonEchoFeedBeacon } from '@/components/stamps/CanonEchoFeedBeacon';
import { AnnetteTransmissionCenter } from '@/components/stamps/AnnetteTransmissionCenter';
import { useAuth } from '@/contexts/AuthContext';

const CommunityDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  
  // Check if user has admin permissions
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === '7utile@gmail.com';

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
            <StampTrackerWidget className="mb-4" showBroadcastControls={true} />
            <RecentStampsWall limit={5} />
            {isAdmin && <BroadcastDashboardPanel />}
            <CanonEchoFeedBeacon />
            <AnnetteTransmissionCenter />
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