import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import RevolutionaryRoleSelector from './RevolutionaryRoleSelector';
import EnhancedProfileContentRenderer from './EnhancedProfileContentRenderer';
import EnhancedDisplayNameSection from './EnhancedDisplayNameSection';
import UnifiedPrivacySettings from './UnifiedPrivacySettings';
import ProfileDynamicNavigation from './ProfileDynamicNavigation';
import ProfileDesktopSidebar from './ProfileDesktopSidebar';

export type ProfileRole = 'personal' | 'provider' | 'collective' | 'crew';

const UnifiedMobileProfile = () => {
  const { user } = useAuth();
  const { profile, loading, error } = useUnifiedProfile();
  const [selectedRole, setSelectedRole] = useState<ProfileRole>('personal');
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-full" />
          <Card>
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-md mx-auto">
          <Card>
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Profile not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Header with Back Button for Mobile */}
        <div className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40 md:hidden">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">My Profile</h1>
              <p className="text-xs text-muted-foreground">Manage your unified profile</p>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                <p className="text-sm text-muted-foreground">Manage your unified profile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex min-h-[calc(100vh-80px)]">
          {/* Desktop Left Sidebar */}
          <div className="hidden md:block">
            <ProfileDesktopSidebar
              profile={profile}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-gradient-to-br from-background to-muted/20">
            {/* Mobile Layout */}
            <div className="md:hidden pb-24"> {/* Bottom padding for mobile nav */}
              <div className="p-4 space-y-6">
                {/* Enhanced Display Name Section */}
                <EnhancedDisplayNameSection profile={profile} />

                {/* Enhanced Profile Content */}
                <EnhancedProfileContentRenderer 
                  profile={profile}
                  selectedRole={selectedRole}
                />

                {/* Unified Privacy Settings */}
                <UnifiedPrivacySettings 
                  profile={profile}
                  selectedRole={selectedRole}
                />
              </div>
            </div>

            {/* Desktop Layout - 2 Column Grid with Proper Spacing */}
            <div className="hidden md:block p-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 gap-8 items-start">
                  {/* Left Column */}
                  <div className="space-y-8">
                    {/* Enhanced Display Name Section */}
                    <EnhancedDisplayNameSection profile={profile} />

                    {/* Enhanced Profile Content */}
                    <EnhancedProfileContentRenderer 
                      profile={profile}
                      selectedRole={selectedRole}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    {/* Unified Privacy Settings */}
                    <UnifiedPrivacySettings 
                      profile={profile}
                      selectedRole={selectedRole}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Mobile Navigation - Only shows on mobile */}
      <div className="md:hidden">
        <ProfileDynamicNavigation
          profile={profile}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />
      </div>
    </>
  );
};

export default UnifiedMobileProfile;