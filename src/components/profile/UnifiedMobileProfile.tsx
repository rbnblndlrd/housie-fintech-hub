import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import ProfileTabNavigation, { ProfileTab } from './ProfileTabNavigation';
import PersonalTab from './PersonalTab';
import BusinessTab from './BusinessTab';

const UnifiedMobileProfile = () => {
  const { user } = useAuth();
  const { profile, loading, error } = useUnifiedProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Mobile Header with Back Button */}
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
            <p className="text-xs text-muted-foreground">Manage your profile settings</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block p-6 border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal and business information</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <ProfileTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        profile={profile}
      />

      {/* Content Area */}
      <div className="flex-1">
        {/* Mobile Layout */}
        <div className="md:hidden p-4">
          {activeTab === 'personal' && <PersonalTab profile={profile} />}
          {activeTab === 'business' && <BusinessTab profile={profile} />}
        </div>

        {/* Desktop Layout - 2 Column Grid */}
        <div className="hidden md:block p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activeTab === 'personal' && <PersonalTab profile={profile} />}
              {activeTab === 'business' && <BusinessTab profile={profile} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedMobileProfile;