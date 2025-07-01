
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Users, 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Globe,
  Award,
  Lock,
  Smartphone,
  BarChart3,
  UserCheck,
  CreditCard,
  Headphones
} from 'lucide-react';

const CompetitiveAdvantage = () => {
  const advantages = [
    {
      icon: Shield,
      title: "Industry-Leading Safety",
      description: "All providers undergo comprehensive background checks and verification",
      features: ["Background checks", "Identity verification", "Insurance validation", "Continuous monitoring"],
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast Booking",
      description: "Book services in under 60 seconds with our streamlined process",
      features: ["One-click booking", "Instant confirmation", "Real-time availability", "Smart recommendations"],
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: MapPin,
      title: "GPS-Powered Matching",
      description: "Advanced location-based matching for optimal service delivery",
      features: ["Real-time GPS tracking", "Route optimization", "Location-based pricing", "Emergency dispatch"],
      color: "from-purple-600 to-violet-600"
    },
    {
      icon: Users,
      title: "Community-Driven Platform",
      description: "Built by the community, for the community with transparent reviews",
      features: ["Verified reviews", "Community ratings", "Peer recommendations", "Local insights"],
      color: "from-orange-600 to-red-600"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Data-driven insights for both customers and service providers",
      features: ["Performance tracking", "Market insights", "Pricing analytics", "Demand forecasting"],
      color: "from-indigo-600 to-blue-600"
    },
    {
      icon: CreditCard,
      title: "Transparent Pricing",
      description: "No hidden fees, clear pricing structure with competitive rates",
      features: ["Upfront pricing", "No surge pricing", "Flexible payment options", "Money-back guarantee"],
      color: "from-teal-600 to-cyan-600"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Services Completed", value: "500K+", icon: CheckCircle },
    { label: "Cities Covered", value: "25+", icon: MapPin },
    { label: "Average Rating", value: "4.9", icon: Star }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="fintech-button-primary px-6 py-3 text-sm font-bold mb-6 rounded-2xl">
                🚀 COMPETITIVE ADVANTAGE
              </Badge>
              <h1 className="text-5xl font-bold text-white mb-6">
                Why Choose HOUSIE?
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Discover what makes HOUSIE the leading home services platform in Quebec
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <Card key={index} className="fintech-metric-card text-center">
                  <CardContent className="p-6">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="opacity-70">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Advantages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {advantages.map((advantage, index) => (
                <Card key={index} className="fintech-card group">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${advantage.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <advantage.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="mb-2">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 opacity-80">{advantage.description}</p>
                    <ul className="space-y-2">
                      {advantage.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Technology Section */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="text-center text-3xl mb-4">
                  <Globe className="h-8 w-8 inline mr-3" />
                  Built with Cutting-Edge Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Mobile-First Design</h3>
                    <p className="opacity-80">Optimized for mobile devices with intuitive touch interfaces</p>
                  </div>
                  <div className="text-center">
                    <Lock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
                    <p className="opacity-80">Bank-level encryption and security protocols protect your data</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Award-Winning UX</h3>
                    <p className="opacity-80">Recognized for outstanding user experience and design</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompetitiveAdvantage;
