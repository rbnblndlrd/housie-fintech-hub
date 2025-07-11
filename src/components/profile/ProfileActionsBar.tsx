import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Share2, 
  Eye, 
  Copy, 
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UnifiedUserProfile } from '@/types/userProfile';

interface ProfileActionsBarProps {
  profile: UnifiedUserProfile;
  isProvider: boolean;
}

const ProfileActionsBar: React.FC<ProfileActionsBarProps> = ({ profile, isProvider }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const canShareProfile = () => {
    // Basic trust level check - can be expanded
    return profile.verified || (profile.total_reviews && profile.total_reviews > 0);
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/provider/${profile.user_id}`;
    
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Profile URL Copied!",
        description: "Share this link to let others view your professional profile.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the URL manually from your browser.",
        variant: "destructive"
      });
    }
  };

  const handlePreviewProfile = () => {
    const previewUrl = `/provider/${profile.user_id}?preview=true`;
    window.open(previewUrl, '_blank');
  };

  if (!isProvider) return null;

  return (
    <Card className="bg-muted/20 border-muted-foreground/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground mb-1">Public Profile</h4>
            <p className="text-sm text-muted-foreground">
              {canShareProfile() 
                ? "Your profile is ready to share with customers" 
                : "Complete verification to unlock public sharing"
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviewProfile}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareProfile}
              disabled={!canShareProfile()}
              className="flex items-center gap-2"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileActionsBar;