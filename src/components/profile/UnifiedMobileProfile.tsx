import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Briefcase, User } from 'lucide-react';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProfileTabNavigation, { ProfileTab } from './ProfileTabNavigation';
import ProfileMainContainer from './ProfileMainContainer';

const UnifiedMobileProfile = () => {
  const { user } = useAuth();
  const { profile, loading, error } = useUnifiedProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const navigate = useNavigate();

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
            {/* Mobile Navigation - Floating Back Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="bg-slate-50/90 backdrop-blur-sm border-slate-200 shadow-lg"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            {/* Tab Navigation */}
            <div className="mb-6">
              <ProfileTabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
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