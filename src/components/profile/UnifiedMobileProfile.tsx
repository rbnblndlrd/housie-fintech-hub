import React, { useState } from 'react';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import RevolutionaryRoleSelector from './RevolutionaryRoleSelector';
import EnhancedProfileContentRenderer from './EnhancedProfileContentRenderer';
import EnhancedDisplayNameSection from './EnhancedDisplayNameSection';
import UnifiedPrivacySettings from './UnifiedPrivacySettings';

export type ProfileRole = 'personal' | 'provider' | 'collective' | 'crew';

const UnifiedMobileProfile = () => {
  const { user } = useAuth();
  const { profile, loading, error } = useUnifiedProfile();
  const [selectedRole, setSelectedRole] = useState<ProfileRole>('personal');

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your unified profile</p>
        </div>
      </div>

      {/* Content - Responsive Layout */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Revolutionary Role Selector */}
          <RevolutionaryRoleSelector
            profile={profile}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />

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

        {/* Desktop Layout - Horizontal */}
        <div className="hidden md:flex md:gap-8 md:space-y-0">
          {/* Left Column - Profile Content */}
          <div className="flex-1 space-y-6">
            {/* Revolutionary Role Selector */}
            <RevolutionaryRoleSelector
              profile={profile}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />

            {/* Enhanced Profile Content */}
            <EnhancedProfileContentRenderer 
              profile={profile}
              selectedRole={selectedRole}
            />
          </div>

          {/* Right Column - Settings & Display Name */}
          <div className="w-96 space-y-6">
            {/* Enhanced Display Name Section */}
            <EnhancedDisplayNameSection profile={profile} />

            {/* Unified Privacy Settings */}
            <UnifiedPrivacySettings 
              profile={profile}
              selectedRole={selectedRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedMobileProfile;