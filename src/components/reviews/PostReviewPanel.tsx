import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, MessageCircle, Star, Trophy, Zap, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PostReviewPanelProps {
  bookingId: string;
  userCommendations: string[];
  onClose: () => void;
}

interface CommendationEarned {
  type: string;
  label: string;
  icon: string;
  description: string;
}

interface PrestigeData {
  currentTitle: string;
  currentLevel: number;
  pointsToNext: number;
  totalPoints: number;
  nextTitleName: string;
}

const COMMENDATION_DEFINITIONS = {
  punctual: { label: 'Punctual Pro', icon: '⏰', description: 'Always on time, always reliable' },
  quality: { label: 'Above & Beyond', icon: '⭐', description: 'Consistently exceeds expectations' },
  friendly: { label: 'Clear Communicator', icon: '💬', description: 'Excellent communication skills' },
  professional: { label: 'Trust Guardian', icon: '🛡️', description: 'Maintains highest professional standards' },
  reliable: { label: 'Reliable Partner', icon: '🤝', description: 'Dependable service every time' },
  clean: { label: 'Attention to Detail', icon: '✨', description: 'Meticulous work quality' }
};

const ANNETTE_QUIPS = {
  withCommendations: [
    "Now THAT'S how you earn a rep, sugar. One more and you're unlocking the next title! 💅",
    "I smell a promotion coming 👀",
    "Mmm-hmm, you earned your stripes! Welcome to the trust club.",
    "Both sides left love? Messaging is ON, baby 💌",
    "Look at you building that credibility empire! 🏆"
  ],
  noCommendations: [
    "No kudos this time, but hey — not every gig is fireworks. We move.",
    "Still building that rep, I see. Rome wasn't built in a day, honey! 🏗️",
    "Points earned, but no extra sparkle this round. Next job's your moment! ✨"
  ],
  messagingUnlocked: [
    "Messaging UNLOCKED! Now you can slide into those DMs professionally 📱",
    "Trust level: ACTIVATED. Y'all can chat directly now! 💬",
    "Connection established! The messaging gates have opened 🎉"
  ]
};

const PRESTIGE_TITLES = [
  { min: 0, max: 9, title: 'Getting Started', level: 1 },
  { min: 10, max: 24, title: 'Reliable Member', level: 2 },
  { min: 25, max: 49, title: 'Trusted Partner', level: 3 },
  { min: 50, max: 99, title: 'Top Rated', level: 4 },
  { min: 100, max: 199, title: 'Crew Prodigy', level: 5 },
  { min: 200, max: 499, title: 'Network Legend', level: 6 },
  { min: 500, max: 999, title: 'Platform Master', level: 7 },
  { min: 1000, max: Infinity, title: 'HOUSIE Elite', level: 8 }
];

export const PostReviewPanel: React.FC<PostReviewPanelProps> = ({
  bookingId,
  userCommendations,
  onClose
}) => {
  const { user } = useAuth();
  const [prestigeData, setPrestigeData] = useState<PrestigeData | null>(null);
  const [messagingUnlocked, setMessagingUnlocked] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPostReviewData();
  }, [bookingId, user]);

  const loadPostReviewData = async () => {
    if (!user) return;

    try {
      // Get user's current community points
      const { data: profileData } = await supabase
        .from('provider_profiles')
        .select('community_rating_points')
        .eq('user_id', user.id)
        .single();

      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('total_credits')
        .eq('user_id', user.id)
        .single();

      const totalPoints = profileData?.community_rating_points || creditsData?.total_credits || 0;

      // Calculate prestige
      const currentTier = PRESTIGE_TITLES.find(tier => 
        totalPoints >= tier.min && totalPoints <= tier.max
      ) || PRESTIGE_TITLES[0];

      const nextTier = PRESTIGE_TITLES.find(tier => tier.min > totalPoints) || PRESTIGE_TITLES[PRESTIGE_TITLES.length - 1];

      setPrestigeData({
        currentTitle: currentTier.title,
        currentLevel: currentTier.level,
        pointsToNext: nextTier.min - totalPoints,
        totalPoints,
        nextTitleName: nextTier.title
      });

      // Check if messaging was unlocked
      const { data: connectionData } = await supabase
        .from('service_connections')
        .select('can_message, cred_connection_established')
        .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`)
        .eq('last_booked_date', new Date().toISOString().split('T')[0])
        .single();

      setMessagingUnlocked(connectionData?.can_message || false);

      // Calculate points awarded (base + commendation bonus)
      const basePoints = 3; // Job completion points
      const commendationBonus = userCommendations.length;
      setPointsAwarded(basePoints + commendationBonus);

    } catch (error) {
      console.error('Error loading post-review data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomQuip = (category: keyof typeof ANNETTE_QUIPS) => {
    const quips = ANNETTE_QUIPS[category];
    return quips[Math.floor(Math.random() * quips.length)];
  };

  const earnedCommendations: CommendationEarned[] = userCommendations.map(type => ({
    type,
    ...COMMENDATION_DEFINITIONS[type as keyof typeof COMMENDATION_DEFINITIONS]
  }));

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Calculating rewards...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Review Complete! 🎉
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Here's what you earned from this service
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Points Awarded */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
            <Star className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-700">+{pointsAwarded} Community Points</span>
          </div>
        </div>

        {/* Commendations Earned */}
        {earnedCommendations.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Commendations Earned
            </h3>
            <div className="grid gap-3">
              {earnedCommendations.map((commendation) => (
                <div key={commendation.type} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">{commendation.icon}</span>
                  <div>
                    <p className="font-medium text-purple-700">{commendation.label}</p>
                    <p className="text-sm text-purple-600">{commendation.description}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prestige Progress */}
        {prestigeData && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Prestige Progress
            </h3>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {prestigeData.currentTitle} - Level {prestigeData.currentLevel}
                </Badge>
                <span className="text-sm font-medium">{prestigeData.totalPoints} points</span>
              </div>
              <Progress 
                value={(prestigeData.totalPoints / (prestigeData.totalPoints + prestigeData.pointsToNext)) * 100} 
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                {prestigeData.pointsToNext > 0 
                  ? `${prestigeData.pointsToNext} points to ${prestigeData.nextTitleName}`
                  : 'Maximum prestige reached!'
                }
              </p>
            </div>
          </div>
        )}

        {/* Messaging Unlock */}
        {messagingUnlocked && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-700 mb-1">
                  🎉 Messaging Unlocked!
                </p>
                <p className="text-sm text-blue-600">
                  You're now connected! Direct messaging is available for future bookings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Annette Commentary */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div>
              <p className="font-medium text-purple-700 mb-1">Annette's Take</p>
              <p className="text-sm text-purple-600 italic">
                {earnedCommendations.length > 0
                  ? messagingUnlocked 
                    ? getRandomQuip('messagingUnlocked')
                    : getRandomQuip('withCommendations')
                  : getRandomQuip('noCommendations')
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t">
          <Button onClick={onClose} className="w-full">
            Continue to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};