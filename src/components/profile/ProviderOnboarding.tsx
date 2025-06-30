
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Briefcase, Star, Shield, CheckCircle } from 'lucide-react';

interface ProviderOnboardingProps {
  onProviderEnabled: () => void;
}

const ProviderOnboarding: React.FC<ProviderOnboardingProps> = ({ onProviderEnabled }) => {
  const { user } = useAuth();
  const { forceRefresh } = useRoleSwitch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const enableProviderMode = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update user profile to enable provider services
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          can_provide_services: true,
          active_role: 'provider'
        })
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('✅ Provider mode enabled in database, refreshing context...');
      
      // Force refresh the role context to pick up the new capabilities
      if (forceRefresh) {
        await forceRefresh();
        console.log('✅ Context refreshed successfully');
      }

      toast({
        title: "Provider Mode Enabled!",
        description: "You can now switch between customer and provider roles.",
      });

      // Call the callback to update parent state
      onProviderEnabled();
    } catch (error) {
      console.error('Error enabling provider mode:', error);
      toast({
        title: "Error",
        description: "Failed to enable provider mode. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out">
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Briefcase className="h-5 w-5" />
            Become a Service Provider
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            Unlock additional features by becoming a service provider on HOUSIE.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Earn Money</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Build Network</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>Verified Profile</span>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              onClick={enableProviderMode}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Enabling...' : 'Enable Provider Mode'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderOnboarding;
