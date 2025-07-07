import React from 'react';
import { Button } from '@/components/ui/button';
import { UnifiedUserProfile } from '@/types/userProfile';
import { cn } from '@/lib/utils';

export type ProfileTab = 'personal' | 'provider';

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
      key: 'provider' as ProfileTab,
      label: 'Provider',
      available: profile.can_provide_services // Only show Provider tab if user is a provider
    }
  ];

  return (
    <div className="px-4 md:px-8 mb-6">
      <div className="flex justify-center">
        <div className="inline-flex bg-card/20 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg">
          {tabs.map((tab) => {
            if (!tab.available) return null;
            
            return (
              <Button
                key={tab.key}
                variant="ghost"
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  "rounded-full px-6 py-2 font-medium transition-all duration-300 text-sm",
                  activeTab === tab.key
                    ? "bg-white/90 text-foreground shadow-md hover:bg-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileTabNavigation;