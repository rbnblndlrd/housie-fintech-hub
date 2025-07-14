import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Bookmark, 
  Share, 
  MessageCircle, 
  Star,
  Calendar,
  Shield
} from 'lucide-react';

interface ProfileInteractionPanelProps {
  profileId: string;
  userId: string;
  username: string;
  canCommend: boolean;
  canonRatio: number;
}

const ProfileInteractionPanel: React.FC<ProfileInteractionPanelProps> = ({
  profileId,
  userId,
  username,
  canCommend,
  canonRatio
}) => {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasCommended, setHasCommended] = useState(false);

  const handleCommend = () => {
    if (!canCommend) {
      toast({
        title: "Cannot commend",
        description: "You can only commend providers you've worked with.",
        variant: "destructive"
      });
      return;
    }

    setHasCommended(true);
    toast({
      title: "Commendation sent! ⭐",
      description: `You've commended ${username} for their excellent service.`,
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Profile bookmarked!",
      description: isBookmarked 
        ? "Removed from your saved providers" 
        : "Added to your saved providers for future bookings",
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Prestige Profile`,
          text: `Check out ${username}'s Prestige Profile - ${canonRatio}% Canon Ratio!`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Profile link copied to clipboard",
      });
    }
  };

  const handleMessage = () => {
    toast({
      title: "Feature coming soon",
      description: "Direct messaging will be available in a future update.",
    });
  };

  const handleBookService = () => {
    toast({
      title: "Book a service",
      description: "Redirecting to booking interface...",
    });
    // Would navigate to booking flow
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Star className="h-5 w-5 text-yellow-400" />
          Interact with {username}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick stats display */}
        <div className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">{canonRatio}%</span>
            </div>
            <p className="text-sm text-gray-300">Canon Trust Rating</p>
          </div>
        </div>

        {/* Action buttons grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Commend */}
          <Button
            onClick={handleCommend}
            disabled={!canCommend || hasCommended}
            className={`
              flex items-center gap-2 justify-center h-12
              ${hasCommended 
                ? 'bg-green-600/20 text-green-400 border border-green-600' 
                : canCommend
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
            variant={hasCommended ? "outline" : "default"}
          >
            <Heart className={`h-4 w-4 ${hasCommended ? 'fill-current' : ''}`} />
            {hasCommended ? 'Commended' : 'Commend'}
          </Button>

          {/* Bookmark */}
          <Button
            onClick={handleBookmark}
            className={`
              flex items-center gap-2 justify-center h-12
              ${isBookmarked 
                ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
              }
            `}
            variant={isBookmarked ? "outline" : "secondary"}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>

          {/* Message */}
          <Button
            onClick={handleMessage}
            className="flex items-center gap-2 justify-center h-12"
            variant="outline"
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>

          {/* Share */}
          <Button
            onClick={handleShare}
            className="flex items-center gap-2 justify-center h-12"
            variant="outline"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Primary action button */}
        <Button
          onClick={handleBookService}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book a Service
        </Button>

        {/* Commend status message */}
        {!canCommend && (
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-400 text-center">
              💡 Book a service with {username} to unlock commendation privileges
            </p>
          </div>
        )}

        {hasCommended && (
          <div className="p-3 bg-green-900/20 rounded-lg border border-green-600/30">
            <p className="text-xs text-green-400 text-center flex items-center justify-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              You've commended this provider's excellent service
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInteractionPanel;