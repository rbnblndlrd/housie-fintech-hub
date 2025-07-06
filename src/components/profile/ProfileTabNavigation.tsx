import React from 'react';
import { Button } from '@/components/ui/button';
import { UnifiedUserProfile } from '@/types/userProfile';
import { cn } from '@/lib/utils';

export type ProfileTab = 'personal' | 'business';

interface ProfileTabNavigationProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  profile: UnifiedUserProfile;
}

const ProfileTabNavigation: React.FC<ProfileTabNavigationProps> = ({
  activeTab,
  onTabChange,
  profile
}) => {
  const tabs = [
    {
      key: 'personal' as ProfileTab,
      label: 'Personal',
      available: true
    },
    {
      key: 'business' as ProfileTab,
      label: 'Business',
      available: true // Always show Business tab - let BusinessTab component handle provider status
    }
  ];

  return (
    <div className="mb-4">
      <div className="flex">
        {tabs.map((tab) => {
          if (!tab.available) return null;
          
          return (
            <Button
              key={tab.key}
              variant="ghost"
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "rounded-none border-b-2 border-transparent px-6 py-3 font-medium transition-all bg-transparent",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileTabNavigation;