import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Eye, 
  EyeOff, 
  Save, 
  Users, 
  Shield, 
  TrendingUp,
  Network,
  Handshake
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedDisplayNameSectionProps {
  profile: UnifiedUserProfile;
}

const EnhancedDisplayNameSection: React.FC<EnhancedDisplayNameSectionProps> = ({ profile }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.full_name || '');
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [showPreview, setShowPreview] = useState(false);

  // Mock network connections data - in real app would come from database
  const networkStats = {
    totalConnections: profile.network_connections_count || 45,
    connectionsMadeThisMonth: 3,
    averageRatingImprovement: 0.2,
    connectionSuccessRate: 94
  };

  const handleSave = () => {
    // Here you would typically call an API to update the profile
    toast({
      title: "Profile Updated",
      description: "Your display name has been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Display Name Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20 h-full">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Display Name System
            <Badge variant="secondary" className="text-xs ml-auto">
              CRITICAL INNOVATION
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 flex-1">
          {/* Enhanced Info Badge */}
          <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-medium text-foreground">Revolutionary Privacy Protection</p>
                <p className="text-sm text-muted-foreground">
                  Display name shown until booking acceptance. Full name revealed only after confirmation to build trust gradually.
                </p>
                <div className="flex items-center gap-2 text-xs text-primary">
                  <TrendingUp className="h-3 w-3" />
                  <span>94% connection success rate with this system</span>
                </div>
              </div>
            </div>
          </div>

          {/* Display Name Field */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-3 w-3" />
              Display Name (Public)
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name (e.g., Zoé Crevisse)"
              disabled={!isEditing}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              This name appears in search results and initial communications
            </p>
          </div>

          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
              <EyeOff className="h-3 w-3" />
              Full Legal Name (Private)
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full legal name (e.g., Zoé Lamarre)"
              disabled={!isEditing}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Revealed only after booking confirmation for security and trust
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

          {/* Enhanced Preview Example */}
          {showPreview && (
            <div className="space-y-4 p-4 bg-muted/20 rounded-lg border-l-4 border-primary">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                How others see you during the booking process:
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50/50 rounded-lg border border-red-200/50">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                      👁️ Initial Search
                    </Badge>
                    <span className="text-sm font-medium">{displayName || 'Zoé Crevisse'}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Anonymous</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-yellow-50/50 rounded-lg border border-yellow-200/50">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-700">
                      💬 Chat Phase
                    </Badge>
                    <span className="text-sm font-medium">{displayName || 'Zoé Crevisse'}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Protected</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg border border-green-200/50">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                      ✅ Post-Acceptance
                    </Badge>
                    <span className="text-sm font-medium">{fullName || 'Zoé Lamarre'}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Revealed</span>
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

      {/* Network Connections Counter Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-green-200/50 h-full">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="h-4 w-4 text-green-600" />
            Network Connections Impact
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 flex-1">
          {/* Main Network Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50/50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Handshake className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {networkStats.totalConnections}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Total Connections Made
              </p>
            </div>
            
            <div className="p-3 bg-blue-50/50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  +{networkStats.connectionsMadeThisMonth}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                New This Month
              </p>
            </div>
          </div>

          {/* Connection Success Metrics */}
          <div className="p-4 bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-lg border border-green-200/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Connection Success Rate</span>
              <Badge className="bg-green-600 hover:bg-green-700">
                {networkStats.connectionSuccessRate}%
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Name reveal system builds trust gradually</p>
              <p>• Higher booking completion rates</p>
              <p>• Reduced fraud and safety concerns</p>
            </div>
          </div>

          {/* Network Quality Indicator */}
          <div className="flex items-center justify-center gap-2 p-3 bg-primary/5 rounded-lg">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Network connections made through name reveals: {networkStats.totalConnections}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDisplayNameSection;