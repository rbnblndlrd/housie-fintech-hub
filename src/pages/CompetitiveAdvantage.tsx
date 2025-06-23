
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, DollarSign, FileCheck, Users, Zap, Crown, Target, TrendingUp, ArrowRight, CheckCircle, Sparkles, Award } from 'lucide-react';
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
      icon: <Shield className="h-10 w-10" />,
      title: "Escrow Protection",
      description: "Money secured until service completion - revolutionary trust model that protects both parties",
      metric: "100% Protected",
      color: "emerald"
    },
    {
      icon: <DollarSign className="h-10 w-10" />,
      title: "Guaranteed Outcomes", 
      description: "Providers know they'll be paid, customers know their investment is completely safe",
      metric: "94% to Provider",
      color: "blue"
    },
    {
      icon: <FileCheck className="h-10 w-10" />,
      title: "Compliance Simplified",
      description: "Built-in audit trails, streamlined reporting, dramatically reduced regulatory burden",
      metric: "$10K Savings",
      color: "purple"
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Natural Dispute Resolution",
      description: "Escrow creates inherent fairness - conflicts resolve themselves automatically",
      metric: "85% Auto-Resolve",
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-competitive-cream via-stone-50 to-amber-50 text-competitive-navy overflow-hidden">
      <Header />
      
      {/* Hero Section - Elegant Typography Focus */}
      <section className="pt-32 pb-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-competitive-gold/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-12">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-competitive-gold to-competitive-bronze mr-6"></div>
            <Crown className="h-20 w-20 text-competitive-gold mr-6 animate-pulse-gold" />
            <h1 className="text-8xl md:text-9xl font-display font-black text-transparent bg-gradient-to-r from-competitive-navy via-competitive-gold to-competitive-bronze bg-clip-text tracking-tight">
              US vs THEM
            </h1>
            <Target className="h-20 w-20 text-competitive-bronze ml-6 animate-float" />
            <div className="w-24 h-1 bg-gradient-to-r from-competitive-bronze via-competitive-gold to-transparent ml-6"></div>
          </div>
          
          <p className="text-2xl md:text-3xl font-heading font-light text-competitive-charcoal mb-8 max-w-5xl mx-auto leading-relaxed">
            In a world divided between 
            <span className="font-semibold text-competitive-gold"> outdated approaches</span> and 
            <span className="font-bold text-competitive-navy"> revolutionary solutions</span>
          </p>
          
          <div className="flex items-center justify-center space-x-8 mb-16">
            <Badge className="bg-gradient-to-r from-competitive-gold/20 to-competitive-bronze/20 text-competitive-navy border-competitive-gold/40 px-8 py-4 text-xl font-bold font-heading shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              THE EVOLVED SOLUTION
            </Badge>
          </div>
        </div>
      </section>

      {/* The Divide Section - Dramatic Visual Contrast */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-100/40 to-amber-100/40"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-display font-bold mb-8 text-competitive-navy">
              THE FUNDAMENTAL DIVIDE
            </h2>
            <p className="text-xl font-heading text-competitive-charcoal max-w-4xl mx-auto font-medium">
              While they clung to broken models, we built the future
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* THEM - Left Side with Faded Styling */}
            <div className="lg:col-span-1 space-y-8 transform lg:-rotate-2 opacity-75">
              <div className="text-center mb-12 p-8 bg-stone-200/60 rounded-2xl border-2 border-stone-300/50 shadow-lg">
                <h3 className="text-4xl font-display font-bold text-stone-600 mb-4">THEM</h3>
                <p className="text-stone-500 font-heading text-lg">The Old Guard</p>
              </div>
              
              {oldApproaches.map((approach, index) => (
                <Card key={index} className="bg-white/60 border-2 border-stone-300/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-stone-600 text-xl font-heading font-semibold">{approach.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {approach.issues.map((issue, issueIndex) => (
                        <div key={issueIndex} className="flex items-start text-sm text-stone-500 font-medium">
                          <span className="mr-3 text-red-400 text-lg">✗</span>
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* VS - Center Dramatic Element */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-competitive-gold/30 to-competitive-bronze/30 border-4 border-competitive-gold/50 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                  <span className="text-5xl font-display font-black text-competitive-navy">VS</span>
                </div>
                <div className="absolute -top-6 -right-6">
                  <Zap className="h-12 w-12 text-competitive-gold animate-pulse" />
                </div>
                <div className="absolute -bottom-6 -left-6">
                  <Sparkles className="h-10 w-10 text-competitive-bronze animate-float" />
                </div>
              </div>
              <ArrowRight className="h-12 w-12 text-competitive-gold mt-12 transform rotate-90 lg:rotate-0 animate-pulse" />
            </div>

            {/* US - Right Side with Golden Accent */}
            <div className="lg:col-span-1 transform lg:rotate-2">
              <div className="text-center mb-12 p-8 bg-gradient-to-br from-competitive-gold/15 to-competitive-bronze/15 rounded-2xl border-2 border-competitive-gold/40 shadow-xl backdrop-blur-sm">
                <h3 className="text-4xl font-display font-bold bg-gradient-to-r from-competitive-navy to-competitive-gold bg-clip-text text-transparent mb-4">
                  US
                </h3>
                <p className="text-competitive-gold font-heading text-lg font-semibold">The Evolution</p>
              </div>

              <Card className="bg-gradient-to-br from-white/90 to-competitive-cream/90 border-2 border-competitive-gold/60 relative overflow-hidden hover:scale-105 transition-all duration-500 shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-competitive-gold/10 to-transparent"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-competitive-navy text-3xl font-display font-bold flex items-center">
                    <Award className="w-8 h-8 mr-3 text-competitive-gold" />
                    The Escrow Revolution
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {['Pay', 'Deliver', 'Confirm', 'Release'].map((step, index) => (
                      <div key={step} className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-competitive-gold/20 to-competitive-bronze/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-competitive-gold/30 shadow-lg">
                          <span className="text-competitive-navy font-heading font-bold text-lg">{index + 1}</span>
                        </div>
                        <p className="text-sm font-heading font-semibold text-competitive-charcoal">{step}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-competitive-charcoal text-center font-medium leading-relaxed">
                    Money protected in escrow until perfect satisfaction
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why US - Dynamic Showcase */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-competitive-gold/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-display font-bold mb-8 bg-gradient-to-r from-competitive-navy to-competitive-gold bg-clip-text text-transparent">
              WHY US
            </h2>
            <p className="text-2xl font-heading text-competitive-charcoal font-medium">Advantages that change everything</p>
          </div>

          <div className="space-y-20">
            {ourAdvantages.map((advantage, index) => (
              <div key={index} className={`flex items-center gap-16 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <Card className={`bg-gradient-to-br from-white/95 to-stone-50/95 border-2 border-competitive-gold/30 hover:border-competitive-gold/60 transition-all duration-500 transform hover:scale-105 ${index % 2 === 1 ? 'hover:rotate-2' : 'hover:-rotate-2'} shadow-xl hover:shadow-2xl backdrop-blur-sm`}>
                    <CardContent className="p-10">
                      <div className="flex items-start gap-8">
                        <div className={`text-${advantage.color}-600 group-hover:scale-110 transition-transform duration-300 p-4 rounded-2xl bg-gradient-to-br from-competitive-gold/10 to-competitive-bronze/10 border border-competitive-gold/20`}>
                          {advantage.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-competitive-navy mb-6 text-3xl">{advantage.title}</h3>
                          <p className="text-competitive-charcoal mb-6 leading-relaxed text-lg font-medium">{advantage.description}</p>
                          <Badge className="bg-gradient-to-r from-competitive-gold/20 to-competitive-bronze/20 text-competitive-navy border-competitive-gold/40 px-6 py-2 text-base font-bold font-heading shadow-md">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {advantage.metric}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Connecting visual element */}
                <div className="hidden lg:block">
                  <div className="w-32 h-2 bg-gradient-to-r from-competitive-gold/60 to-competitive-bronze/60 rounded-full shadow-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Victory Metrics - Prominent Display */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-100/60 to-amber-100/60"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-8 text-competitive-navy">
              THE VICTORY METRICS
            </h2>
            <p className="text-xl font-heading text-competitive-charcoal font-medium">Numbers don't lie</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: TrendingUp, value: "94%", label: "Provider Earnings", subtitle: "vs industry standard 70-85%", color: "emerald" },
              { icon: Shield, value: "100%", label: "Payment Protection", subtitle: "Both sides fully covered", color: "blue" },
              { icon: FileCheck, value: "$10K", label: "Annual Savings", subtitle: "Compliance costs reduced", color: "purple" }
            ].map((metric, index) => (
              <Card key={index} className="bg-gradient-to-br from-white/95 to-stone-50/95 border-2 border-competitive-gold/40 text-center hover:scale-110 transition-all duration-500 hover:border-competitive-gold/70 shadow-xl hover:shadow-2xl backdrop-blur-sm group">
                <CardContent className="p-10">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-competitive-gold/10 to-competitive-bronze/10 border border-competitive-gold/20 mb-6 group-hover:scale-105 transition-transform duration-300">
                    <metric.icon className={`h-16 w-16 mx-auto text-${metric.color}-600`} />
                  </div>
                  <div className={`text-5xl font-display font-black mb-4 text-${metric.color}-600`}>{metric.value}</div>
                  <p className="text-competitive-navy font-heading font-bold text-xl mb-2">{metric.label}</p>
                  <p className="text-sm text-competitive-charcoal font-medium">{metric.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision - Grand Finale */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-display font-bold mb-12 bg-gradient-to-r from-competitive-navy via-competitive-gold to-competitive-bronze bg-clip-text text-transparent">
            THE FUTURE IS OURS
          </h2>
          <p className="text-2xl font-heading text-competitive-charcoal mb-16 leading-relaxed font-medium max-w-4xl mx-auto">
            While they scramble to catch up, we're already building tomorrow
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { icon: "🧠", label: "AI-Powered Analytics", desc: "Intelligent insights at your fingertips" },
              { icon: "💰", label: "Complete Fintech Suite", desc: "All-in-one financial ecosystem" },
              { icon: "🤖", label: "Smart Automation", desc: "Effortless workflow optimization" },
              { icon: "📊", label: "Business Intelligence", desc: "Data-driven decision making" }
            ].map((feature, index) => (
              <div key={index} className="group">
                <Card className="bg-gradient-to-br from-white/95 to-stone-50/95 border-2 border-competitive-gold/30 p-8 hover:border-competitive-gold/60 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm">
                  <CardContent className="p-0 text-center">
                    <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="text-competitive-navy font-heading font-bold text-xl mb-3">{feature.label}</h3>
                    <p className="text-competitive-charcoal font-medium">{feature.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <Button className="bg-gradient-to-r from-competitive-gold to-competitive-bronze hover:from-competitive-bronze hover:to-competitive-gold text-white font-bold px-16 py-6 text-xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-heading rounded-2xl">
            <Crown className="w-6 h-6 mr-3" />
            Join the Winning Side
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CompetitiveAdvantage;
