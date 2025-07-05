import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Eye, EyeOff, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DisplayNameSectionProps {
  profile: UnifiedUserProfile;
}

const DisplayNameSection: React.FC<DisplayNameSectionProps> = ({ profile }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.full_name || '');
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    // Here you would typically call an API to update the profile
    toast({
      title: "Profile Updated",
      description: "Your display name has been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          Display Name System
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Info Badge */}
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Privacy Protection</p>
              <p>Display name shown until booking acceptance. Full name revealed only after confirmation.</p>
            </div>
          </div>
        </div>

        {/* Display Name Field */}
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-sm font-medium">
            Display Name
          </Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
            disabled={!isEditing}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            This name appears in search results and initial communications
          </p>
        </div>

        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full Legal Name
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full legal name"
            disabled={!isEditing}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Revealed only after booking confirmation for security
          </p>
        </div>

        {/* Preview Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="text-sm font-medium">Preview Mode</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
        </div>

        {/* Preview Example */}
        {showPreview && (
          <div className="space-y-3 p-4 bg-muted/20 rounded-lg border-l-4 border-primary">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              How others see you:
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Before Booking</Badge>
                <span className="text-sm font-medium">{displayName || 'Zoé Crevisse'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs">After Acceptance</Badge>
                <span className="text-sm font-medium">{fullName || 'Zoé Lamarre'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              Edit Names
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayNameSection;