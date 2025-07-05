import React, { useState } from 'react';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DynamicRoleSelector from './DynamicRoleSelector';
import ProfileContentRenderer from './ProfileContentRenderer';
import PrivacySettingsUnified from './PrivacySettingsUnified';
import DisplayNameSection from './DisplayNameSection';

export type ProfileRole = 'personal' | 'provider' | 'customer' | 'crew' | 'collective';

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
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your unified profile</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Dynamic Role Selector */}
        <DynamicRoleSelector
          profile={profile}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />

        {/* Display Name Section */}
        <DisplayNameSection profile={profile} />

        {/* Profile Content */}
        <ProfileContentRenderer 
          profile={profile}
          selectedRole={selectedRole}
        />

        {/* Unified Privacy Settings */}
        <PrivacySettingsUnified 
          profile={profile}
          selectedRole={selectedRole}
        />
      </div>
    </div>
  );
};

export default UnifiedMobileProfile;