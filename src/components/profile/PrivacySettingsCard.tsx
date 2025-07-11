import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import PrivacyMiniMap from './PrivacyMiniMap';

interface PrivacySettingsCardProps {
  profile: UnifiedUserProfile;
  isEditing: boolean;
}

const PrivacySettingsCard: React.FC<PrivacySettingsCardProps> = ({ profile, isEditing }) => {
  const [privacyRadius, setPrivacyRadius] = useState(3);

  const handlePrivacyZoneChange = (radius: number) => {
    setPrivacyRadius(radius);
    // TODO: Save to database
    console.log('Privacy zone updated to:', radius + 'km');
  };

  return (
    <Card className="bg-muted/30 backdrop-blur-md border border-muted-foreground/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-orange-600" />
          Location Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Control how your location appears to others on the platform.
          </div>
          
          {/* Privacy Mini-Map */}
          <PrivacyMiniMap 
            isEditing={isEditing}
            onPrivacyZoneChange={handlePrivacyZoneChange}
            initialRadius={privacyRadius}
          />
          
          <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
            <p className="text-xs text-orange-300">
              <Shield className="h-3 w-3 inline mr-1" />
              Your exact location is never shown. Others see you within this comfort radius for safety and privacy.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettingsCard;