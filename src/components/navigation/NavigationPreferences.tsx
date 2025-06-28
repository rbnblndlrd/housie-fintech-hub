
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Shield, Navigation, ExternalLink } from 'lucide-react';

type NavigationPreference = 'google_maps' | 'housie_navigation' | 'system_default';

interface NavigationPreferencesProps {
  currentPreference?: NavigationPreference;
  onPreferenceChange?: (preference: NavigationPreference) => void;
}

const NavigationPreferences: React.FC<NavigationPreferencesProps> = ({
  currentPreference = 'google_maps',
  onPreferenceChange
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPreference, setSelectedPreference] = useState<NavigationPreference>(currentPreference);
  const [loading, setLoading] = useState(false);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true);

  useEffect(() => {
    loadNavigationPreference();
  }, [user]);

  const loadNavigationPreference = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('provider_settings')
        .select('navigation_preference')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading navigation preference:', error);
        return;
      }

      if (data?.navigation_preference) {
        setSelectedPreference(data.navigation_preference as NavigationPreference);
      }
    } catch (error) {
      console.error('Error loading navigation preference:', error);
    }
  };

  const saveNavigationPreference = async (preference: NavigationPreference) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('provider_settings')
        .upsert({
          user_id: user.id,
          navigation_preference: preference,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSelectedPreference(preference);
      onPreferenceChange?.(preference);

      toast({
        title: "Navigation Preference Updated",
        description: getPreferenceDescription(preference),
      });

      // Hide privacy banner after trying HOUSIE Navigation
      if (preference === 'housie_navigation') {
        setShowPrivacyBanner(false);
      }
    } catch (error) {
      console.error('Error saving navigation preference:', error);
      toast({
        title: "Error",
        description: "Failed to save navigation preference",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPreferenceDescription = (preference: NavigationPreference): string => {
    switch (preference) {
      case 'google_maps':
        return 'Using Google Maps for navigation';
      case 'housie_navigation':
        return 'Using HOUSIE Navigation (Privacy-First GPS)';
      case 'system_default':
        return 'Using your phone\'s default navigation app';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy-First Banner */}
      {showPrivacyBanner && selectedPreference !== 'housie_navigation' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Try HOUSIE Navigation (Privacy-First)
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Your Quebec routes stay private with HOUSIE Navigation. Unlike other platforms, 
                  we don't sell your location data and keep your routes within Quebec.
                </p>
                <Button
                  size="sm"
                  onClick={() => saveNavigationPreference('housie_navigation')}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  Try Privacy-First GPS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Navigation Preference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedPreference}
            onValueChange={(value) => saveNavigationPreference(value as NavigationPreference)}
            disabled={loading}
          >
            {/* Google Maps Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="google_maps" id="google_maps" />
              <Label htmlFor="google_maps" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Google Maps</div>
                    <div className="text-sm text-gray-600">
                      Standard Google Maps navigation (current default)
                    </div>
                  </div>
                  <Badge variant="secondary">Current Default</Badge>
                </div>
              </Label>
            </div>

            {/* HOUSIE Navigation Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg border-blue-200 bg-blue-50">
              <RadioGroupItem value="housie_navigation" id="housie_navigation" />
              <Label htmlFor="housie_navigation" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      HOUSIE Navigation
                      <Badge className="bg-blue-600 text-white">Privacy-First GPS</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Full turn-by-turn navigation with French/English voice guidance
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      • Your Quebec routes stay in Quebec
                      • Multi-stop route optimization
                      • Offline maps for rural areas
                      • Real-time traffic updates
                    </div>
                  </div>
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
              </Label>
            </div>

            {/* System Default Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="system_default" id="system_default" />
              <Label htmlFor="system_default" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">System Default</div>
                    <div className="text-sm text-gray-600">
                      Opens your phone's default navigation app
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Quebec Data Sovereignty Message */}
          {selectedPreference === 'housie_navigation' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Quebec Data Sovereignty</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your navigation data stays within Quebec and is never sold to third parties. 
                We comply with Quebec's data protection standards.
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 pt-2">
            You can change your navigation preference anytime. All systems maintain 
            full compatibility with your existing job workflow.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationPreferences;
