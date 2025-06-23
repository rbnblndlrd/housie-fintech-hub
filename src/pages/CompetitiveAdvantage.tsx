
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, DollarSign, FileCheck, Users, Zap, Crown, Sword, Target } from 'lucide-react';
import Header from '@/components/Header';

const CompetitiveAdvantage = () => {
  const competitors = [
    {
      name: "Uber",
      model: "Commission-based",
      issues: ["No payment protection", "Driver income uncertainty", "Complex dispute resolution"],
      color: "text-gray-500"
    },
    {
      name: "Airbnb", 
      model: "Fee-based",
      issues: ["Host payment delays", "Guest refund complications", "Trust issues"],
      color: "text-red-500"
    },
    {
      name: "TaskRabbit",
      model: "Traditional payment",
      issues: ["Payment processing risks", "No guaranteed payment", "Limited protection"],
      color: "text-orange-500"
    }
  ];

  const escrowAdvantages = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Ultimate Protection",
      description: "Money held safely until service completion - both sides protected"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Guaranteed Payment", 
      description: "Providers know they'll get paid, customers know their money is safe"
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "CRA Compliance Made Easy",
      description: "Clear audit trails, simplified reporting, reduced compliance costs"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Built-in Dispute Resolution",
      description: "Natural conflict resolution with money held neutrally until resolved"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />
      
      {/* Hero Section - Battle Theme */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-12 w-12 text-yellow-500 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              THE LAST ONE STANDING
            </h1>
            <Sword className="h-12 w-12 text-yellow-500 ml-4" />
          </div>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            After the dust settled from the platform wars, only one business model survived the battle: 
            <span className="text-yellow-400 font-semibold"> The Escrow Revolution</span>
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-12">
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/50 px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              94% to Providers
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/50 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              100% Protected
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/50 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Game Changer
            </Badge>
          </div>
        </div>
      </section>

      {/* Escrow Model Showcase */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-yellow-400">
              THE ESCROW REVOLUTION
            </h2>
            <p className="text-xl text-gray-300">How HOUSIE changed the game forever</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h3 className="font-semibold text-green-400 mb-2">Customer Pays</h3>
                <p className="text-sm text-gray-400">Money safely held in HOUSIE escrow</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h3 className="font-semibold text-blue-400 mb-2">Service Delivered</h3>
                <p className="text-sm text-gray-400">Provider completes the work</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h3 className="font-semibold text-purple-400 mb-2">Customer Confirms</h3>
                <p className="text-sm text-gray-400">Work approved and accepted</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">4️⃣</span>
                </div>
                <h3 className="font-semibold text-yellow-400 mb-2">Payment Released</h3>
                <p className="text-sm text-gray-400">94% to provider, 6% to HOUSIE</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {escrowAdvantages.map((advantage, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="text-yellow-400 mb-4">{advantage.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{advantage.title}</h3>
                  <p className="text-sm text-gray-400">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Battlefield Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-red-400">
              THE BATTLEFIELD
            </h2>
            <p className="text-xl text-gray-300">How the competition fell one by one</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {/* HOUSIE - The Winner */}
            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Crown className="h-6 w-6 text-yellow-400" />
              </div>
              <CardHeader>
                <CardTitle className="text-yellow-400 text-center">HOUSIE</CardTitle>
                <Badge className="bg-yellow-500 text-black mx-auto">WINNER</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-green-400">
                    <Shield className="h-4 w-4 mr-2" />
                    Escrow Protection
                  </div>
                  <div className="flex items-center text-green-400">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Guaranteed Payment
                  </div>
                  <div className="flex items-center text-green-400">
                    <FileCheck className="h-4 w-4 mr-2" />
                    CRA Compliant
                  </div>
                  <div className="flex items-center text-green-400">
                    <Users className="h-4 w-4 mr-2" />
                    Built-in Disputes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitors - The Fallen */}
            {competitors.map((competitor, index) => (
              <Card key={index} className="bg-gray-800/30 border-gray-600 opacity-75">
                <CardHeader>
                  <CardTitle className={`${competitor.color} text-center`}>{competitor.name}</CardTitle>
                  <Badge variant="outline" className="border-red-500 text-red-400 mx-auto">FALLEN</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500 mb-3">{competitor.model}</p>
                  <div className="space-y-2">
                    {competitor.issues.map((issue, issueIndex) => (
                      <div key={issueIndex} className="flex items-start text-xs text-red-400">
                        <span className="mr-2">❌</span>
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Battle Stats */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center text-yellow-400">VICTORY STATISTICS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">$15K</div>
                  <p className="text-sm text-gray-400">Annual Compliance Costs<br/><span className="text-red-400">(vs $25K traditional)</span></p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">94%</div>
                  <p className="text-sm text-gray-400">Provider Earnings<br/><span className="text-green-400">(Industry leading)</span></p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                  <p className="text-sm text-gray-400">Payment Protection<br/><span className="text-green-400">(Both sides covered)</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Future Vision Teaser */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-purple-400">
            THE EMPIRE EXPANDS
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The escrow revolution was just the beginning...
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/50 p-3">
              🧠 AI-Powered Analytics
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/50 p-3">
              💰 Complete Fintech Suite
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/50 p-3">
              🤖 Smart Automation
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/50 p-3">
              📊 Business Intelligence
            </Badge>
          </div>

          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3">
            Join the Revolution
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CompetitiveAdvantage;
