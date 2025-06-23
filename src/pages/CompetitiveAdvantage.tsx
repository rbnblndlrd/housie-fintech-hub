
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, DollarSign, FileCheck, Users, Zap, Crown, Target, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

const CompetitiveAdvantage = () => {
  const oldApproaches = [
    {
      title: "Traditional Payment Models",
      issues: ["Payment uncertainty", "Trust gaps", "Complex disputes", "Higher risk exposure"]
    },
    {
      title: "Commission-Heavy Platforms", 
      issues: ["Provider income erosion", "Hidden fee structures", "Payment delays", "Limited protection"]
    },
    {
      title: "Legacy Service Models",
      issues: ["Outdated payment flows", "Compliance complications", "Trust deficits", "Poor dispute resolution"]
    }
  ];

  const ourAdvantages = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Escrow Protection",
      description: "Money secured until service completion - revolutionary trust model",
      metric: "100% Protected"
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Guaranteed Outcomes", 
      description: "Providers know they'll be paid, customers know their investment is safe",
      metric: "94% to Provider"
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "Compliance Simplified",
      description: "Built-in audit trails, streamlined reporting, reduced regulatory burden",
      metric: "$10K Savings"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Natural Dispute Resolution",
      description: "Escrow creates inherent fairness - conflicts resolve themselves",
      metric: "85% Auto-Resolve"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden">
      <Header />
      
      {/* Hero Section - Enhanced with diagonal elements */}
      <section className="pt-24 pb-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent transform skew-y-1"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-amber-500 mr-4"></div>
            <Crown className="h-16 w-16 text-amber-500 mr-4" />
            <h1 className="text-7xl font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
              US vs THEM
            </h1>
            <Target className="h-16 w-16 text-amber-500 ml-4" />
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-transparent ml-4"></div>
          </div>
          
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            In a world divided between outdated approaches and revolutionary solutions,
            <span className="text-amber-400 font-semibold"> we chose evolution</span>
          </p>
          
          <div className="flex items-center justify-center space-x-8 mb-12">
            <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30 px-8 py-4 text-xl font-bold">
              THE EVOLVED SOLUTION
            </Badge>
          </div>
        </div>
      </section>

      {/* The Divide Section - Dynamic Battlefield Layout */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 to-gray-800/20 transform -skew-y-1"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-100">
              THE FUNDAMENTAL DIVIDE
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              While they clung to broken models, we built the future
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* THEM - Left Side */}
            <div className="lg:col-span-1 space-y-6 transform lg:-rotate-1">
              <div className="text-center mb-8 p-6 bg-gray-800/40 rounded-lg border border-gray-600">
                <h3 className="text-3xl font-bold text-gray-500 mb-4">THEM</h3>
                <p className="text-gray-600">The Old Guard</p>
              </div>
              
              {oldApproaches.map((approach, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-600 opacity-70 hover:opacity-90 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-500 text-lg">{approach.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {approach.issues.map((issue, issueIndex) => (
                        <div key={issueIndex} className="flex items-start text-sm text-gray-600">
                          <span className="mr-2 text-red-500">✗</span>
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* VS - Center Divider */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/30 flex items-center justify-center">
                  <span className="text-4xl font-bold text-amber-400">VS</span>
                </div>
                <div className="absolute -top-4 -right-4">
                  <Zap className="h-8 w-8 text-amber-500 animate-pulse" />
                </div>
              </div>
              <ArrowRight className="h-8 w-8 text-amber-500 mt-8 transform rotate-90 lg:rotate-0" />
            </div>

            {/* US - Right Side */}
            <div className="lg:col-span-1 transform lg:rotate-1">
              <div className="text-center mb-8 p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg border border-amber-500/30">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-4">
                  US
                </h3>
                <p className="text-amber-400">The Evolution</p>
              </div>

              <Card className="bg-gradient-to-br from-amber-500/15 to-yellow-500/15 border-amber-500/40 relative overflow-hidden hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent"></div>
                <CardHeader>
                  <CardTitle className="text-amber-400 text-2xl relative z-10">The Escrow Revolution</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {['Pay', 'Deliver', 'Confirm', 'Release'].map((step, index) => (
                      <div key={step} className="text-center">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-500/30">
                          <span className="text-amber-400 font-bold">{index + 1}</span>
                        </div>
                        <p className="text-xs text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-300 text-center">
                    Money protected in escrow until perfect satisfaction
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why US - Dynamic Alternating Layout */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-slate-800/10 to-transparent transform skew-y-1"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              WHY US
            </h2>
            <p className="text-xl text-gray-400">Advantages that change everything</p>
          </div>

          <div className="space-y-16">
            {ourAdvantages.map((advantage, index) => (
              <div key={index} className={`flex items-center gap-12 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <Card className={`bg-gradient-to-br from-slate-800/40 to-gray-800/40 border-gray-700 hover:border-amber-500/50 transition-all duration-300 transform hover:scale-105 ${index % 2 === 1 ? 'hover:rotate-1' : 'hover:-rotate-1'}`}>
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="text-amber-500 group-hover:scale-110 transition-transform duration-300">
                          {advantage.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-4 text-xl">{advantage.title}</h3>
                          <p className="text-gray-400 mb-4 leading-relaxed">{advantage.description}</p>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            {advantage.metric}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Connecting visual element */}
                <div className="hidden lg:block">
                  <div className="w-24 h-1 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Victory Metrics - Floating Elements */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-gray-800/30 transform -skew-y-1"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-100">
              THE VICTORY METRICS
            </h2>
            <p className="text-xl text-gray-400">Numbers don't lie</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, value: "94%", label: "Provider Earnings", subtitle: "vs industry standard 70-85%", color: "green" },
              { icon: Shield, value: "100%", label: "Payment Protection", subtitle: "Both sides fully covered", color: "blue" },
              { icon: FileCheck, value: "$10K", label: "Annual Savings", subtitle: "Compliance costs reduced", color: "purple" }
            ].map((metric, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-gray-800/50 border-gray-700 text-center hover:scale-110 transition-all duration-300 hover:border-amber-500/50">
                <CardContent className="p-8">
                  <metric.icon className={`h-12 w-12 mx-auto mb-4 ${
                    metric.color === 'green' ? 'text-green-400' : 
                    metric.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                  }`} />
                  <div className={`text-4xl font-bold mb-2 ${
                    metric.color === 'green' ? 'text-green-400' : 
                    metric.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                  }`}>{metric.value}</div>
                  <p className="text-gray-400">{metric.label}</p>
                  <p className="text-xs text-gray-500 mt-2">{metric.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision - Interactive Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
            THE FUTURE IS OURS
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            While they scramble to catch up, we're already building tomorrow
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: "🧠", label: "AI-Powered Analytics" },
              { icon: "💰", label: "Complete Fintech Suite" },
              { icon: "🤖", label: "Smart Automation" },
              { icon: "📊", label: "Business Intelligence" }
            ].map((feature, index) => (
              <div key={index} className="group">
                <Card className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 border-gray-600 p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-0 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <p className="text-gray-300 font-medium">{feature.label}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-12 py-4 text-lg hover:scale-105 transition-all duration-300">
            Join the Winning Side
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CompetitiveAdvantage;
