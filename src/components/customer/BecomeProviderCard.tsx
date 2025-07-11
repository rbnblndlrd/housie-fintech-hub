import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Users,
  Clock,
  Shield
} from 'lucide-react';

const BecomeProviderCard = () => {
  const { enableProviderMode } = useUnifiedProfile();
  const { forceRefresh } = useRoleSwitch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEnableProvider = async () => {
    setLoading(true);
    try {
      await enableProviderMode();
      await forceRefresh?.();
      
      toast({
        title: "Provider Mode Enabled!",
        description: "Complete your profile setup to start earning.",
      });

      // Navigate to provider setup page
      navigate('/provider-setup');
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

  const features = [
    {
      icon: DollarSign,
      title: "Start Earning",
      description: "Set your rates and get paid for services"
    },
    {
      icon: Users,
      title: "Build Network",
      description: "Connect with customers in your area"
    },
    {
      icon: Star,
      title: "Build Reputation",
      description: "Earn reviews and build your brand"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work when you want, where you want"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Protected payments and verified customers"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 rounded-full p-3">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-blue-900">
          Become a Service Provider
        </CardTitle>
        <p className="text-blue-700">
          Turn your skills into income by offering services to customers in your area
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <feature.icon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">{feature.title}</h4>
                <p className="text-sm text-blue-700">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white/80 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-blue-900 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            What you get:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              "Free account setup",
              "Customer matching",
              "Secure payments",
              "24/7 support",
              "Marketing tools", 
              "Performance analytics"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3">
          <Button 
            onClick={handleEnableProvider}
            disabled={loading}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              'Enabling Provider Mode...'
            ) : (
              <>
                Start Earning Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Free Setup
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              No Monthly Fees
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BecomeProviderCard;