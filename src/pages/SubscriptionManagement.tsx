
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Check, 
  Star, 
  Calendar, 
  CreditCard, 
  Download,
  RefreshCw,
  AlertTriangle,
  Shield,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Mock subscription data
  const currentPlan = {
    name: "Premium Plan",
    price: 29.99,
    billing: "monthly",
    status: "active",
    nextBilling: "2024-02-15",
    usage: {
      bookings: { used: 45, limit: 100 },
      analytics: { used: 12, limit: 50 },
      support: { used: 3, limit: 10 }
    }
  };

  const plans = [
    {
      name: "Free",
      price: 0,
      billing: "forever",
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
      current: false
    },
    {
      name: "Starter",
      price: 9.99,
      billing: "monthly",
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
      current: false
    },
    {
      name: "Premium",
      price: 29.99,
      billing: "monthly",
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
      current: true
    },
    {
      name: "Enterprise",
      price: 99.99,
      billing: "monthly",
      features: [
        "Unlimited bookings",
        "Dedicated account manager",
        "White-label solution",
        "Advanced API access",
        "Custom integrations",
        "Advanced reporting",
        "Multi-location support",
        "Team management"
      ],
      limitations: [],
      recommended: false,
      current: false
    }
  ];

  const handlePlanChange = async (planName: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Plan Updated",
        description: `Successfully switched to ${planName} plan.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled. You'll retain access until the end of your billing period.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                Subscription Management
              </h1>
              <p className="text-white/90 text-shadow">
                Manage your subscription plan and billing details
              </p>
            </div>

            {/* Current Plan Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-shadow flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    Current Plan: {currentPlan.name}
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                      {currentPlan.status.toUpperCase()}
                    </Badge>
                    <span className="text-white/70">Next billing: {currentPlan.nextBilling}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Monthly Cost</span>
                    <span className="text-white text-2xl font-bold">${currentPlan.price}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">Bookings Used</span>
                        <span className="text-white/70">
                          {currentPlan.usage.bookings.used} / {currentPlan.usage.bookings.limit}
                        </span>
                      </div>
                      <Progress 
                        value={(currentPlan.usage.bookings.used / currentPlan.usage.bookings.limit) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">Analytics Reports</span>
                        <span className="text-white/70">
                          {currentPlan.usage.analytics.used} / {currentPlan.usage.analytics.limit}
                        </span>
                      </div>
                      <Progress 
                        value={(currentPlan.usage.analytics.used / currentPlan.usage.analytics.limit) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">Support Tickets</span>
                        <span className="text-white/70">
                          {currentPlan.usage.support.used} / {currentPlan.usage.support.limit}
                        </span>
                      </div>
                      <Progress 
                        value={(currentPlan.usage.support.used / currentPlan.usage.support.limit) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-shadow flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update Payment Method
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
                    onClick={handleCancelSubscription}
                    disabled={loading}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Available Plans */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white text-shadow-lg mb-6">Available Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.name} 
                    className={`relative bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-105 ${
                      plan.current ? 'ring-2 ring-yellow-400/50' : ''
                    } ${plan.recommended ? 'ring-2 ring-blue-400/50' : ''}`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500 text-white px-3 py-1">
                          <Star className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      </div>
                    )}
                    
                    {plan.current && (
                      <div className="absolute -top-3 right-4">
                        <Badge className="bg-yellow-500 text-black px-3 py-1">
                          Current Plan
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center">
                      <CardTitle className="text-white text-shadow">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-white text-shadow-lg">
                        ${plan.price}
                        <span className="text-lg font-normal text-white/70">/{plan.billing}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-white/90 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {plan.limitations.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-white/20">
                          {plan.limitations.map((limitation, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span className="text-white/70 text-sm">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button 
                        className={`w-full mt-4 ${
                          plan.current 
                            ? 'bg-gray-500/50 cursor-not-allowed' 
                            : plan.recommended 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                        }`}
                        disabled={plan.current || loading}
                        onClick={() => handlePlanChange(plan.name)}
                      >
                        {plan.current ? 'Current Plan' : `Switch to ${plan.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Billing History */}
            <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-shadow flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Billing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "2024-01-15", amount: 29.99, status: "Paid", invoice: "INV-001" },
                    { date: "2023-12-15", amount: 29.99, status: "Paid", invoice: "INV-002" },
                    { date: "2023-11-15", amount: 29.99, status: "Paid", invoice: "INV-003" },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-white font-medium">{transaction.date}</p>
                          <p className="text-white/70 text-sm">{transaction.invoice}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                          {transaction.status}
                        </Badge>
                        <span className="text-white font-bold">${transaction.amount}</span>
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionManagement;
