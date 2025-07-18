import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProviderConversion } from '@/hooks/useProviderConversion';
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
  const { convertToProvider, loading } = useProviderConversion();
  const navigate = useNavigate();

  const handleEnableProvider = async () => {
    try {
      await convertToProvider();
      // Navigate to provider setup after successful conversion
      setTimeout(() => navigate('/provider-setup'), 1000);
    } catch (error) {
      console.error('Provider conversion failed:', error);
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
    <Card className="bg-muted/30 backdrop-blur-md border-muted-foreground/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary rounded-full p-3">
            <Briefcase className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl text-primary">
          Become a Service Provider
        </CardTitle>
        <p className="text-muted-foreground">
          Turn your skills into income by offering services to customers in your area
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <div className="bg-primary/20 rounded-full p-2 flex-shrink-0">
                <feature.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-muted/20 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
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
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
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
            className="w-full"
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
          
          <div className="flex items-center justify-center gap-2 text-sm">
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