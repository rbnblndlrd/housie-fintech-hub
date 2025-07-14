import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStamps } from '@/hooks/useStamps';
import { useFusionTitles } from '@/hooks/useFusionTitles';
import { useDropPoints } from '@/hooks/useDropPoints';
import PrestigeHeroHeader from '@/components/profile/PrestigeHeroHeader';
import StampShowcaseRow from '@/components/stamps/StampShowcaseRow';
import PrestigeStatsSidebar from '@/components/profile/PrestigeStatsSidebar';
import CanonTimeline from '@/components/canon/CanonTimeline';
import ProfileInteractionPanel from '@/components/profile/ProfileInteractionPanel';
import PrestigeVisibilitySettings from '@/components/profile/PrestigeVisibilitySettings';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PrestigeProfileData {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  business_name?: string;
  description?: string;
  bio?: string;
  profile_image_url?: string;
  average_rating?: number;
  total_reviews?: number;
  community_rating_points?: number;
  verification_level?: string;
  verified?: boolean;
  created_at: string;
  profile_settings?: {
    show_canon_ratio: boolean;
    show_equipped_titles: boolean;
    show_stamp_history: boolean;
    show_echo_feed: boolean;
  };
}

const PrestigeProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [canonRatio, setCanonRatio] = useState<number>(0);
  const [canonStreak, setCanonStreak] = useState<number>(0);

  const { data: profileData, isLoading: profileLoading, error } = useQuery({
    queryKey: ['prestige-profile', username],
    queryFn: async () => {
      if (!username) throw new Error('Username is required');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          profile_settings:canon_user_preferences(*)
        `)
        .eq('username', username)
        .single();

      if (error) throw error;
      return data as any; // Type will be handled properly in component
    },
    enabled: !!username
  });

  const { stamps, stats, loading: stampsLoading } = useStamps();
  const { fusionTitles, userFusionTitles, getEquippedTitle } = useFusionTitles();
  const dropPointsQuery = useDropPoints();
  
  // Mock imprints data for now
  const dropPointImprints: any[] = [];

  // Calculate Canon Ratio and Streak
  useEffect(() => {
    if (stamps.length > 0) {
      const canonStamps = stamps.filter(stamp => stamp.contextData?.canonVerified);
      const ratio = Math.round((canonStamps.length / stamps.length) * 100);
      setCanonRatio(ratio);

      // Calculate recent canon streak (last 7 days)
      const recent = canonStamps.filter(stamp => 
        new Date(stamp.earnedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      setCanonStreak(recent.length);
    }
  }, [stamps]);

  if (profileLoading || stampsLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
            <p className="text-gray-400 mb-6">
              The prestige profile you're looking for doesn't exist.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const equippedTitleData = getEquippedTitle();
  const equippedTitle = equippedTitleData ? {
    title_name: equippedTitleData.fusion_title?.name || 'Unknown Title',
    icon: equippedTitleData.fusion_title?.icon || '👑',
    flavor_text: equippedTitleData.fusion_title?.description || 'Elite achievement'
  } : undefined;
  const settings = profileData.profile_settings || {
    show_canon_ratio: true,
    show_equipped_titles: true,
    show_stamp_history: true,
    show_echo_feed: true,
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dark mode background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="text-white hover:bg-white/10 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Hero Header with Avatar, Title, and Badges */}
              <PrestigeHeroHeader
                profile={profileData}
                equippedTitle={equippedTitle}
                canonRatio={settings.show_canon_ratio ? canonRatio : undefined}
                totalStamps={stamps.length}
                prestigeTier={Math.floor(stats.totalStamps / 10) + 1}
              />

              {/* Equipped Stamps Row */}
              {settings.show_equipped_titles && (
                <StampShowcaseRow
                  userId={profileData.user_id}
                  stamps={stamps.slice(0, 5)}
                  showCanonGlow={true}
                />
              )}

              {/* Canon Event Timeline */}
              {settings.show_stamp_history && (
                <CanonTimeline
                  userId={profileData.user_id}
                  stamps={stamps}
                  fusionTitles={userFusionTitles}
                  imprints={dropPointImprints}
                  limit={10}
                />
              )}

              {/* Profile Interaction Panel */}
              <ProfileInteractionPanel
                profileId={profileData.id}
                userId={profileData.user_id}
                username={profileData.username}
                canCommend={true} // Would check if user has booked before
                canonRatio={canonRatio}
              />
            </div>

            {/* Prestige Stats Sidebar */}
            <div className="lg:col-span-1">
              <PrestigeStatsSidebar
                profile={profileData}
                canonRatio={settings.show_canon_ratio ? canonRatio : undefined}
                canonStreak={canonStreak}
                totalBroadcasts={dropPointImprints.length}
                stamps={stamps}
                equippedTitle={equippedTitleData ? {
                  title_name: equippedTitleData.fusion_title?.name || 'Unknown',
                  icon: equippedTitleData.fusion_title?.icon || '👑'
                } : undefined}
                showEchoFeed={settings.show_echo_feed}
              />
            </div>
          </div>

          {/* Settings Panel (only visible to profile owner) */}
          <PrestigeVisibilitySettings
            userId={profileData.user_id}
            currentSettings={settings}
          />
        </div>
      </div>
    </div>
  );
};

export default PrestigeProfile;