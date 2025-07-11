import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';

export const useProviderConversion = () => {
  const { user } = useAuth();
  const { forceRefresh } = useRoleSwitch();
  const { toast } = useToast();
  const { enableProviderMode } = useUnifiedProfile();
  const [loading, setLoading] = useState(false);

  const convertToProvider = async () => {
    if (!user) {
      throw new Error('No user found');
    }

    setLoading(true);
    try {
      console.log('🔄 Starting provider conversion for:', user.email);

      // 1. Enable provider mode in profile
      await enableProviderMode();
      console.log('✅ Provider mode enabled');

      // 2. Create draft service offering
      const { error: serviceError } = await supabase
        .from('service_drafts')
        .insert({
          user_id: user.id,
          title: 'My First Service',
          category: 'cleaning',
          description: 'Professional service, customizable to your needs.',
          status: 'draft'
        });

      if (serviceError) {
        console.error('❌ Error creating draft service:', serviceError);
        // Don't throw - this is non-critical
      } else {
        console.log('✅ Draft service created');
      }

      // 3. Set comfort radius if not already set
      const { error: comfortError } = await supabase
        .from('user_profiles')
        .update({ comfort_km: 5 })
        .eq('user_id', user.id)
        .is('comfort_km', null);

      if (comfortError) {
        console.error('❌ Error setting comfort zone:', comfortError);
        // Don't throw - this is non-critical
      }

      // 4. Trigger Annette onboarding
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        await fetch(`https://dsfaxqfexebqogdxigdu.supabase.co/functions/v1/annette-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZmF4cWZleGVicW9nZHhpZ2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMjkzMDcsImV4cCI6MjA2NTcwNTMwN30.xQ9Op8OxI4bLgr4COp3VW3xIOLHpNaoHtY0ZoQfzdgo',
          },
          body: JSON.stringify({
            message: `Begin onboarding sequence for new provider ${user.email || user.user_metadata?.full_name || 'new user'}`,
            context: { type: 'provider_onboarding' },
            sessionId: `onboarding-${user.id}-${Date.now()}`,
            userId: user.id,
            featureType: 'provider_onboarding'
          })
        });
        console.log('✅ Annette onboarding triggered');
      } catch (annetteError) {
        console.error('❌ Annette onboarding failed:', annetteError);
        // Don't throw - this is non-critical
      }

      // 5. Force refresh role context
      await forceRefresh?.();

      // 6. Show success toast
      toast({
        title: "🎉 Welcome to Provider Mode!",
        description: "Your account has been upgraded. Complete your profile to start earning.",
      });

      console.log('✅ Provider conversion completed successfully');
      return true;

    } catch (error) {
      console.error('❌ Provider conversion failed:', error);
      toast({
        title: "Conversion Failed",
        description: "Failed to enable provider mode. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    convertToProvider,
    loading
  };
};