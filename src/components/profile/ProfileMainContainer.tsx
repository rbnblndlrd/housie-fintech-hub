import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Edit3, 
  Crown,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import PrivacySettingsCard from './PrivacySettingsCard';
import PrestigeShowcaseCard from './PrestigeShowcaseCard';
import BecomeProviderCard from '@/components/customer/BecomeProviderCard';
import ProviderDashboardPreview from './ProviderDashboardPreview';
import CrewSuggestions from './CrewSuggestions';
import AnnetteProfileAdvisor from './AnnetteProfileAdvisor';
import ProfileActionsBar from './ProfileActionsBar';
import CrewStatusCard from './CrewStatusCard';
import { EquippedStampRow } from '@/components/stamps/EquippedStampRow';

interface ProfileMainContainerProps {
  profile: UnifiedUserProfile;
  isProvider: boolean;
}

const ProfileMainContainer: React.FC<ProfileMainContainerProps> = ({ profile, isProvider }) => {
  const { toast } = useToast();
  const { canSwitchToProvider } = useRoleSwitch();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditDetails = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      toast({
        title: "Edit Mode Activated",
        description: "You can now edit your profile details.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Annette Profile Advisor - only for own profile */}
      <AnnetteProfileAdvisor profile={profile} isProvider={isProvider} />
      
      {/* Main Profile Container */}
      <Card className="relative overflow-hidden bg-muted/30 backdrop-blur-md border border-muted-foreground/20">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 opacity-30" />
        
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-background shadow-lg">
                <AvatarImage src={profile.profile_image_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg md:text-xl font-semibold">
                  {(profile.full_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">{profile.full_name || 'User'}</h1>
                  {profile.verified && <Crown className="h-5 w-5 text-yellow-500" />}
                </div>
                <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>
                
                {/* Equipped Stamps Medal Row */}
                <EquippedStampRow userId={profile.user_id} className="mb-3" />
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {isProvider ? <Briefcase className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {isProvider ? 'Provider Account' : 'Personal Account'}
                  </Badge>
                  {profile.verified && (
                    <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditDetails}
              className="shrink-0"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'Save' : 'Edit Details'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          {/* Bio/Description Section */}
          <div className="mb-6">
            <div className="p-4 bg-muted/20 backdrop-blur-sm rounded-lg border border-muted-foreground/20">
              <h3 className="font-medium text-foreground mb-2">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.bio || profile.description || 'No description provided yet. Click "Edit Details" to add one!'}
              </p>
            </div>
          </div>

          {/* Provider-specific fields integration */}
          {isProvider && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-muted/20 rounded-lg border border-muted-foreground/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Business</p>
                <p className="font-medium text-foreground">
                  {profile.business_name || 'Individual Provider'}
                </p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg border border-muted-foreground/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Rate</p>
                <p className="font-medium text-foreground">
                  ${profile.hourly_rate || 45}/hr
                </p>
              </div>
            </div>
          )}

          {/* Nested Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Privacy Settings Card */}
            <PrivacySettingsCard 
              profile={profile} 
              isEditing={isEditing}
            />

            {/* Prestige Showcase Card */}
            <PrestigeShowcaseCard 
              profile={profile}
              isEditing={isEditing}
            />
          </div>

          {/* Profile Actions Bar - for providers */}
          {isProvider && (
            <div className="mt-6">
              <ProfileActionsBar profile={profile} isProvider={isProvider} />
            </div>
          )}

          {/* Provider Status Section */}
          {!canSwitchToProvider && !isProvider ? (
            // Show conversion card for customers
            <div className="mt-6">
              <BecomeProviderCard />
            </div>
          ) : canSwitchToProvider && isProvider ? (
            // Show provider dashboard and crew status for providers
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProviderDashboardPreview />
              <CrewStatusCard profile={profile} />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileMainContainer;