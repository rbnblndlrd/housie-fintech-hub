import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Briefcase, User } from 'lucide-react';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProfileTabNavigation, { ProfileTab } from './ProfileTabNavigation';
import ProfileMainContainer from './ProfileMainContainer';

const UnifiedMobileProfile = () => {
  const { user } = useAuth();
  const { profile, loading, error } = useUnifiedProfile();
  const { currentRole, switchRole, isLoading: roleLoading } = useRoleSwitch();
  
  // Initialize activeTab based on currentRole from RoleSwitchContext
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const navigate = useNavigate();

  // Sync activeTab with currentRole when RoleSwitchContext loads
  useEffect(() => {
    if (!roleLoading) {
      const tabFromRole: ProfileTab = currentRole === 'provider' ? 'provider' : 'personal';
      console.log('🔄 UnifiedMobileProfile: Syncing tab with role:', { currentRole, tabFromRole });
      setActiveTab(tabFromRole);
    }
  }, [currentRole, roleLoading]);

  // Handle tab changes by actually switching roles
  const handleTabChange = async (tab: ProfileTab) => {
    console.log('🎭 UnifiedMobileProfile: Tab change requested:', { from: activeTab, to: tab });
    
    try {
      // Determine the new role based on tab selection
      const newRole = tab === 'provider' ? 'provider' : 'customer';
      
      // Only switch if it's actually different
      if (newRole !== currentRole) {
        console.log('🔄 UnifiedMobileProfile: Switching role:', { from: currentRole, to: newRole });
        await switchRole(newRole);
      }
      
      // Update local state
      setActiveTab(tab);
    } catch (error) {
      console.error('❌ UnifiedMobileProfile: Error switching role:', error);
      // Revert tab to current role on error
      setActiveTab(currentRole === 'provider' ? 'provider' : 'personal');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-full" />
          <Card className="bg-slate-50">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <Skeleton className="h-6 w-48 mx-auto" />
              <div className="grid grid-cols-1 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-slate-50">
            <CardContent className="p-6 text-center">
              <p className="text-destructive">Error: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-slate-50">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Profile not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Content Area - Full Screen on Mobile, Normal on Desktop */}
      <div className="flex-1">
        {/* Mobile: Full screen layout, Desktop: Normal padding */}
        <div className="p-2 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Navigation - Above Dashboard tab */}
            <div className="md:hidden fixed top-[94px] left-[22px] z-50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="bg-white border-slate-300 shadow-lg text-slate-800 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            {/* Tab Navigation */}
            <div className="mb-6">
              <ProfileTabNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                profile={profile}
              />
            </div>

            {/* Main Profile Container */}
            <ProfileMainContainer 
              profile={profile} 
              isProvider={activeTab === 'provider'} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedMobileProfile;