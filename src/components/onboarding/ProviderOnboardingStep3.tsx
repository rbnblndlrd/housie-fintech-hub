import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  Clock,
  Upload,
  Camera,
  Shield,
  Award,
  ExternalLink
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const ProviderOnboardingStep3: React.FC<Props> = ({
  onBack
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const finishOnboarding = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // 1. Trigger Annette onboarding
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
            message: `🎉 Welcome aboard, ${user.user_metadata?.full_name || user.email}! I'll help you prep your first service, track earnings, and get job offers soon. You're live!`,
            context: { type: 'provider_onboarding_complete' },
            sessionId: `onboarding-complete-${user.id}-${Date.now()}`,
            userId: user.id,
            featureType: 'provider_onboarding_complete'
          })
        });
        console.log('✅ Annette onboarding completion triggered');
      } catch (annetteError) {
        console.error('❌ Annette notification failed:', annetteError);
      }

      // 2. Show success toast
      toast({
        title: "🎉 Onboarding Complete!",
        description: "Welcome to HOUSIE! Your provider profile is now live.",
      });

      // 3. Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error finishing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verificationItems = [
    {
      icon: CheckCircle,
      title: 'Email Verified',
      status: user?.email_confirmed_at ? 'completed' : 'pending',
      description: 'Your email address has been confirmed',
      action: null
    },
    {
      icon: Upload,
      title: 'Upload Photo ID',
      status: 'optional',
      description: 'Government-issued ID for enhanced trust',
      action: 'Coming Soon'
    },
    {
      icon: Camera,
      title: 'Profile Picture',
      status: 'optional',
      description: 'Add a professional photo to your profile',
      action: 'Coming Soon'
    },
    {
      icon: Shield,
      title: 'Background Check',
      status: 'optional',
      description: 'Professional background verification',
      action: (
        <Button
          variant="outline"
          size="sm"
          className="border-muted-foreground/20"
          onClick={() => window.open('https://certn.co', '_blank')}
        >
          Visit Certn <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      )
    }
  ];

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Award className="h-5 w-5" />
          Verification & Setup
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete these steps to build trust with customers and boost your ranking.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {verificationItems.map((item, index) => {
            const Icon = item.icon;
            const getStatusColor = () => {
              switch (item.status) {
                case 'completed': return 'text-green-400';
                case 'pending': return 'text-yellow-400';
                case 'optional': return 'text-muted-foreground';
                default: return 'text-muted-foreground';
              }
            };

            const getStatusIcon = () => {
              switch (item.status) {
                case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
                case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
                default: return <div className="h-4 w-4" />; // placeholder
              }
            };

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-muted-foreground/20 bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${getStatusColor()}`} />
                  <div>
                    <h4 className="font-medium text-card-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.action && typeof item.action === 'string' ? (
                    <span className="text-sm text-muted-foreground">{item.action}</span>
                  ) : item.action}
                  {getStatusIcon()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-green-900/50 text-card-foreground border border-green-300/30 rounded-xl px-4 py-3">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            You're ready to start earning!
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Your provider profile is complete</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Service offerings are ready for customers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>You can start receiving booking requests</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-muted-foreground/20"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={finishOnboarding}
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {loading ? 'Finishing...' : 'Finish Onboarding 🎉'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};