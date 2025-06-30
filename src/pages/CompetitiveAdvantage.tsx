
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
      icon: Smartphone,
      title: "Mobile-First Experience",
      description: "Optimized for mobile with native app capabilities",
      features: ["Progressive web app", "Offline functionality", "Push notifications", "Touch-optimized interface"],
      color: "from-pink-600 to-rose-600"
    }
  ];

  const stats = [
    { label: "Service Providers", value: "50,000+", icon: Users },
    { label: "Cities Covered", value: "500+", icon: Globe },
    { label: "Customer Satisfaction", value: "4.9/5", icon: Star },
    { label: "Response Time", value: "<30s", icon: Clock },
    { label: "Background Checks", value: "100%", icon: Shield },
    { label: "Uptime", value: "99.9%", icon: TrendingUp }
  ];

  const comparisons = [
    {
      feature: "Background Checks",
      housie: true,
      competitor1: false,
      competitor2: true,
      competitor3: false
    },
    {
      feature: "GPS Route Optimization",
      housie: true,
      competitor1: false,
      competitor2: false,
      competitor3: false
    },
    {
      feature: "24/7 Customer Support",
      housie: true,
      competitor1: true,
      competitor2: false,
      competitor3: true
    },
    {
      feature: "Insurance Coverage",
      housie: true,
      competitor1: false,
      competitor2: true,
      competitor3: false
    },
    {
      feature: "Emergency Services",
      housie: true,
      competitor1: false,
      competitor2: false,
      competitor3: false
    },
    {
      feature: "Real-time Tracking",
      housie: true,
      competitor1: true,
      competitor2: false,
      competitor3: false
    },
    {
      feature: "Community Reviews",
      housie: true,
      competitor1: true,
      competitor2: true,
      competitor3: true
    },
    {
      feature: "Advanced Analytics",
      housie: true,
      competitor1: false,
      competitor2: false,
      competitor3: false
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white text-shadow-lg mb-6">
                Why Choose HOUSIE?
              </h1>
              <p className="text-xl text-white/90 text-shadow max-w-3xl mx-auto mb-8">
                We're not just another service marketplace. We're revolutionizing how people connect 
                with trusted local service providers through cutting-edge technology and community-first values.
              </p>
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm px-8 py-3 text-lg">
                Get Started Today
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl text-center">
                  <CardContent className="p-6">
                    <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white text-shadow-lg">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Advantages */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white text-shadow-lg text-center mb-8">
                Our Competitive Advantages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advantages.map((advantage, index) => (
                  <Card key={index} className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl hover:scale-105 transition-transform duration-200">
                    <CardHeader>
                      <div className={`w-12 h-12 bg-gradient-to-r ${advantage.color} rounded-xl flex items-center justify-center mb-4`}>
                        <advantage.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-white text-shadow">{advantage.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 mb-4">{advantage.description}</p>
                      <div className="space-y-2">
                        {advantage.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <span className="text-white/90 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white text-shadow-lg text-center mb-8">
                How We Stack Up
              </h2>
              <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-4 text-white font-bold">Feature</th>
                        <th className="text-center p-4">
                          <div className="flex flex-col items-center">
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 mb-2">
                              <Award className="h-3 w-3 mr-1" />
                              HOUSIE
                            </Badge>
                          </div>
                        </th>
                        <th className="text-center p-4 text-white/70">Competitor A</th>
                        <th className="text-center p-4 text-white/70">Competitor B</th>
                        <th className="text-center p-4 text-white/70">Competitor C</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisons.map((comparison, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 text-white font-medium">{comparison.feature}</td>
                          <td className="p-4 text-center">
                            {comparison.housie ? (
                              <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                            ) : (
                              <div className="h-5 w-5 bg-red-500/20 rounded-full mx-auto" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {comparison.competitor1 ? (
                              <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                            ) : (
                              <div className="h-5 w-5 bg-red-500/20 rounded-full mx-auto" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {comparison.competitor2 ? (
                              <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                            ) : (
                              <div className="h-5 w-5 bg-red-500/20 rounded-full mx-auto" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {comparison.competitor3 ? (
                              <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                            ) : (
                              <div className="h-5 w-5 bg-red-500/20 rounded-full mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Technology Stack */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white text-shadow-lg text-center mb-8">
                Powered by Cutting-Edge Technology
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { icon: Lock, title: "Enterprise Security", desc: "Bank-level encryption and security protocols" },
                  { icon: Zap, title: "Lightning Performance", desc: "Sub-second response times and 99.9% uptime" },
                  { icon: Smartphone, title: "Mobile-First", desc: "Progressive web app with native capabilities" },
                  { icon: BarChart3, title: "AI-Powered Insights", desc: "Machine learning for optimal matching" }
                ].map((tech, index) => (
                  <Card key={index} className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl text-center">
                    <CardContent className="p-6">
                      <tech.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-white font-bold text-lg mb-2">{tech.title}</h3>
                      <p className="text-white/70 text-sm">{tech.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30 backdrop-blur-md shadow-xl">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold text-white text-shadow-lg mb-4">
                  Ready to Experience the Difference?
                </h2>
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who have made the switch to HOUSIE. 
                  Experience superior service, unmatched safety, and cutting-edge technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm px-8">
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-8">
                    Schedule Demo
                  </Button>
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
