
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, DollarSign, FileCheck, Users, Zap, Crown, Target, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <Crown className="h-16 w-16 text-yellow-600 mr-4" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
              US vs THEM
            </h1>
            <Target className="h-16 w-16 text-yellow-600 ml-4" />
          </div>
          
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            In a world divided between outdated approaches and revolutionary solutions,
            <span className="text-yellow-400 font-semibold"> we chose evolution</span>
          </p>
          
          <div className="flex items-center justify-center space-x-8 mb-12">
            <Badge className="bg-gradient-to-r from-yellow-600 to-amber-500 text-black px-6 py-3 text-lg font-bold">
              THE EVOLVED SOLUTION
            </Badge>
          </div>
        </div>
      </section>

      {/* The Divide Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-800/40 to-gray-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-100">
              THE FUNDAMENTAL DIVIDE
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              While they clung to broken models, we built the future
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* THEM - Old Ways */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-400 mb-4">THEM</h3>
                <p className="text-gray-500">The Old Guard</p>
              </div>
              
              {oldApproaches.map((approach, index) => (
                <Card key={index} className="bg-gray-800/60 border-gray-600 opacity-80">
                  <CardHeader>
                    <CardTitle className="text-gray-400 text-lg">{approach.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {approach.issues.map((issue, issueIndex) => (
                        <div key={issueIndex} className="flex items-start text-sm text-gray-500">
                          <span className="mr-2 text-red-400">✗</span>
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* US - New Way */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-400 bg-clip-text text-transparent mb-4">
                  US
                </h3>
                <p className="text-yellow-400">The Evolution</p>
              </div>

              <Card className="bg-gradient-to-br from-yellow-600/20 to-amber-500/20 border-yellow-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 to-transparent"></div>
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-2xl">The Escrow Revolution</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-400 font-bold">1</span>
                      </div>
                      <p className="text-xs text-gray-300">Pay</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-400 font-bold">2</span>
                      </div>
                      <p className="text-xs text-gray-300">Deliver</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-400 font-bold">3</span>
                      </div>
                      <p className="text-xs text-gray-300">Confirm</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-400 font-bold">4</span>
                      </div>
                      <p className="text-xs text-gray-300">Release</p>
                    </div>
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

      {/* Why We Won */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-amber-400 bg-clip-text text-transparent">
              WHY WE WON
            </h2>
            <p className="text-xl text-gray-400">The advantages that changed everything</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ourAdvantages.map((advantage, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {advantage.icon}
                  </div>
                  <h3 className="font-bold text-white mb-4 text-lg">{advantage.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">{advantage.description}</p>
                  <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                    {advantage.metric}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Numbers */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-800/40 to-gray-800/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-100">
              THE VICTORY METRICS
            </h2>
            <p className="text-xl text-gray-400">Numbers don't lie</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-slate-800/60 to-gray-800/60 border-gray-700 text-center">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-green-400 mb-2">94%</div>
                <p className="text-gray-400">Provider Earnings</p>
                <p className="text-xs text-gray-500 mt-2">vs industry standard 70-85%</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/60 to-gray-800/60 border-gray-700 text-center">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                <p className="text-gray-400">Payment Protection</p>
                <p className="text-xs text-gray-500 mt-2">Both sides fully covered</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/60 to-gray-800/60 border-gray-700 text-center">
              <CardContent className="p-8">
                <FileCheck className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-purple-400 mb-2">$10K</div>
                <p className="text-gray-400">Annual Savings</p>
                <p className="text-xs text-gray-500 mt-2">Compliance costs reduced</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-amber-400 bg-clip-text text-transparent">
            THE FUTURE IS OURS
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            While they scramble to catch up, we're already building tomorrow
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Badge className="bg-slate-800/60 text-gray-300 border-gray-600 p-4 text-center">
              🧠 AI-Powered Analytics
            </Badge>
            <Badge className="bg-slate-800/60 text-gray-300 border-gray-600 p-4 text-center">
              💰 Complete Fintech Suite
            </Badge>
            <Badge className="bg-slate-800/60 text-gray-300 border-gray-600 p-4 text-center">
              🤖 Smart Automation
            </Badge>
            <Badge className="bg-slate-800/60 text-gray-300 border-gray-600 p-4 text-center">
              📊 Business Intelligence
            </Badge>
          </div>

          <Button className="bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600 text-black font-bold px-12 py-4 text-lg">
            Join the Winning Side
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CompetitiveAdvantage;
