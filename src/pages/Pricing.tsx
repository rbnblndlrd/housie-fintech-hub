
import React, { useState } from 'react';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, AlertTriangle, Crown, Zap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import BackNavigation from '@/components/navigation/BackNavigation';

const Pricing = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: "Free",
      price: 0,
      billing: "forever",
      icon: <Star className="h-8 w-8 text-gray-400" />,
      features: [
        "Up to 5 bookings per month",
        "Basic customer support",
        "Standard profile",
        "Basic analytics"
      ],
      limitations: [
        "Limited booking history",
        "No priority support",
        "Basic features only"
      ],
      recommended: false,
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const
    },
    {
      name: "Starter",
      price: 4.99,
      billing: "monthly",
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      features: [
        "Up to 25 bookings per month",
        "Priority customer support",
        "Enhanced profile",
        "Advanced analytics",
        "Calendar integration",
        "Email notifications"
      ],
      limitations: [
        "Limited advanced features"
      ],
      recommended: false,
      buttonText: "Choose Starter",
      buttonVariant: "default" as const
    },
    {
      name: "Professional",
      price: 8.99,
      billing: "monthly",
      icon: <Crown className="h-8 w-8 text-yellow-500" />,
      features: [
        "Up to 100 bookings per month",
        "24/7 priority support",
        "Professional profile",
        "Full analytics suite",
        "Advanced calendar features",
        "SMS & push notifications",
        "Background check verification",
        "Custom branding"
      ],
      limitations: [],
      recommended: true,
      buttonText: "Choose Professional",
      buttonVariant: "default" as const
    },
    {
      name: "Premium",
      price: 15.99,
      billing: "monthly",
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      features: [
        "Unlimited bookings",
        "Dedicated account manager",
        "Premium profile features",
        "Advanced API access",
        "Custom integrations",
        "Advanced reporting",
        "Multi-location support",
        "Priority feature requests"
      ],
      limitations: [],
      recommended: false,
      buttonText: "Choose Premium",
      buttonVariant: "default" as const
    }
  ];

  const handlePlanSelect = async (planName: string) => {
    setLoading(true);
    try {
      // Simulate plan selection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Plan Selected",
        description: `You've selected the ${planName} plan. Redirecting to checkout...`,
      });
      
      // Here you would integrate with your payment provider
      // For now, just show success message
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process plan selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VideoBackground />
      <BackNavigation />
      <div className="relative z-10 min-h-screen">
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-white text-shadow-lg mb-4">
                Choose Your <span className="text-orange-400">Plan</span>
              </h1>
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-6 max-w-4xl mx-auto border border-white/10">
                <p className="text-xl text-white font-medium leading-relaxed tracking-wide drop-shadow-lg">
                  Select the perfect plan for your needs. All plans include our core features 
                  with transparent pricing and no hidden fees.
                </p>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-105 ${
                    plan.recommended ? 'ring-2 ring-blue-400/50 scale-110' : ''
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-white/10 rounded-2xl w-fit">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-white text-shadow">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-white text-shadow-lg">
                      ${plan.price}
                      <span className="text-lg font-normal text-white/70">/{plan.billing}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/90 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.limitations.length > 0 && (
                      <div className="space-y-2 pt-4 border-t border-white/20">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-white/70 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button 
                      className={`w-full mt-6 ${
                        plan.recommended 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : plan.buttonVariant === 'outline'
                            ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                      disabled={loading}
                      onClick={() => handlePlanSelect(plan.name)}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features Comparison */}
            <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white text-shadow text-center">
                  Why Choose HOUSIE?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <Crown className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
                    <p className="text-white/70">
                      Track your business performance with detailed insights and reporting.
                    </p>
                  </div>
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Premium Support</h3>
                    <p className="text-white/70">
                      Get priority support from our dedicated team of experts.
                    </p>
                  </div>
                  <div className="text-center">
                    <Zap className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Crew Collaboration</h3>
                    <p className="text-white/70">
                      Work seamlessly with your crew using our collaboration tools.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center">
              <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl inline-block px-8 py-6">
                <CardContent className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Ready to Get Started?</h3>
                  <p className="text-white/70">
                    Join thousands of professionals who trust HOUSIE for their business needs.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/auth">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Sign Up Now
                      </Button>
                    </Link>
                    <Link to="/help">
                      <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        Contact Sales
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
