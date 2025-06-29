
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, CheckCircle, Eye, FileCheck, Search, Truck, Wrench, Star, Zap, Crown, Check } from "lucide-react";
import { Link } from "react-router-dom";

interface UnifiedHeroSectionProps {
  onUserTypeSelect: (userType: string) => void;
  selectedUserType: string | null;
}

const UnifiedHeroSection = ({ onUserTypeSelect, selectedUserType }: UnifiedHeroSectionProps) => {
  const userTypeOptions = [
    {
      id: "fleet",
      title: "Managing a Fleet?",
      description: "Coordinate multiple service providers and manage operations efficiently",
      icon: <Truck className="h-12 w-12 text-orange-700" />,
      benefits: ["Team coordination", "Bulk scheduling", "Fleet analytics", "Revenue optimization"],
      demoImage: "/lovable-uploads/analytics-dashboard.png"
    },
    {
      id: "provider",
      title: "Looking for Work?",
      description: "Join our network of verified service providers and grow your business",
      icon: <Wrench className="h-12 w-12 text-green-700" />,
      benefits: ["Verified leads", "Flexible scheduling", "Payment protection", "Business tools"],
      demoImage: "/lovable-uploads/housiepro.png"
    },
    {
      id: "customer",
      title: "Need a Local Expert?",
      description: "Find trusted, verified professionals for your home and business needs",
      icon: <Search className="h-12 w-12 text-purple-700" />,
      benefits: ["Verified professionals", "Instant booking", "Secure payments", "Privacy focused"],
      demoImage: "/lovable-uploads/browse-services(broken).png"
    }
  ];

  const plans = [
    {
      name: "Gratuit",
      price: "0",
      period: "pour toujours",
      description: "Parfait pour commencer",
      icon: <Star className="h-6 w-6" />,
      color: "border-black",
      bgColor: "#f8f9fa",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      features: [
        "Jusqu'à 3 types de services",
        "Suivi des dépenses basique", 
        "5 réservations par mois",
        "Support par email",
        "Conformité CRA de base"
      ]
    },
    {
      name: "Starter",
      price: "8",
      period: "/mois",
      description: "Pour les entrepreneurs actifs",
      icon: <Zap className="h-6 w-6" />,
      color: "border-black",
      bgColor: "#f8f9fa",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      features: [
        "Jusqu'à 8 types de services",
        "Analytiques avancées",
        "Réservations illimitées",
        "Assistant IA basique",
        "Optimisation fiscale",
        "Support prioritaire"
      ]
    },
    {
      name: "Pro",
      price: "15",
      period: "/mois",
      description: "Notre plan le plus populaire",
      icon: <Crown className="h-6 w-6" />,
      color: "border-black",
      bgColor: "#f8f9fa",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: true,
      features: [
        "Services illimités",
        "Réservations groupées",
        "IA avancée + automation",
        "Rapports fiscaux détaillés",
        "Intégration bancaire",
        "Support téléphonique",
        "Widgets personnalisés"
      ]
    },
    {
      name: "Premium",
      price: "25",
      period: "/mois",
      description: "Pour les pros qui veulent tout",
      icon: <Crown className="h-6 w-6" />,
      color: "border-black",
      bgColor: "#f8f9fa",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      features: [
        "Tout dans Pro +",
        "Scanner OCR de factures",
        "Parky AI vérificateur",
        "Support white-glove",
        "Insights marché avancés",
        "API access",
        "Manager dédié"
      ]
    }
  ];

  const handleUserTypeSelect = (userType: string) => {
    onUserTypeSelect(userType);
    // Smooth scroll to demo section
    setTimeout(() => {
      document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const selectedOption = userTypeOptions.find(option => option.id === selectedUserType);
  const demoContent = selectedOption || {
    title: "HOUSIE Platform",
    description: "Experience our comprehensive service marketplace",
    benefits: [
      "Find verified professionals instantly",
      "Secure escrow payment protection", 
      "Real-time booking and scheduling",
      "24/7 customer support"
    ],
    demoImage: "/api/placeholder/600/400"
  };

  return (
    <section className="min-h-screen py-20 px-2 sm:px-4 relative overflow-hidden">
      {/* Professional matte olive/forest green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-800 via-green-900 to-stone-900"></div>
      
      <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto relative space-y-32">
        
        {/* Hero Content Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">
          {/* Left Side - Hero Mascot/Visual */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              {/* Main Hero Visual */}
              <div className="relative transform hover:scale-105 transition-all duration-300">
                <div className="w-56 h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden p-1">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl flex items-center justify-center p-1">
                    <img 
                      src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
                      alt="HOUSIE Mascot" 
                      className="w-full h-full rounded-xl object-cover transition-all duration-500"
                      onError={(e) => {
                        console.warn('Mascot image failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                
                {/* Dynamic animated decorative elements */}
                <div className="absolute inset-0 -z-10">
                  {/* Floating geometric shapes */}
                  <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-orange-400/30 to-purple-400/30 rounded-full animate-pulse"></div>
                  <div className="absolute -top-12 -right-12 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-green-400/30 transform rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute -bottom-10 -left-10 w-12 h-12 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute -bottom-8 -right-8 w-14 h-14 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 transform rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Orbiting elements */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                    <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full absolute -top-20 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                    <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full absolute -bottom-20 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '25s' }}>
                    <div className="w-2 h-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-full absolute top-1/2 -left-20 transform -translate-y-1/2"></div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }}>
                    <div className="w-3 h-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full absolute top-1/2 -right-20 transform -translate-y-1/2"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Speech Bubble */}
              <div className="absolute -top-16 lg:-top-20 -right-4 lg:-right-16 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border-2 border-black transform rotate-2 hover:rotate-0 transition-transform duration-300 max-w-xs lg:max-w-sm" style={{ backgroundColor: '#faf7f2' }}>
                <div className="text-lg lg:text-xl font-black text-black">
                  Need a local expert? 🔍
                </div>
                <div className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent" style={{ borderTopColor: '#faf7f2' }}></div>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                  Connect with<br />
                  <span className="text-orange-300 drop-shadow-lg">
                    Professionals
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-medium leading-relaxed drop-shadow-lg max-w-2xl">
                  Connect with verified professionals in your area. Safe, secure, and guaranteed.
                </p>
              </div>
              
              {/* Enhanced Value Props Card */}
              <div className="backdrop-blur-sm p-6 lg:p-8 rounded-2xl border-2 border-black shadow-2xl hover:shadow-3xl transition-all duration-300" style={{ backgroundColor: '#faf7f2' }}>
                <h2 className="text-xl lg:text-2xl font-black text-black mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                  Why Choose HOUSIE?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl border-2 border-black" style={{ backgroundColor: '#faf7f2' }}>
                    <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-black block text-sm lg:text-base">Escrow Protection</span>
                      <span className="text-xs lg:text-sm text-gray-800">Your money is safe</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl border-2 border-black" style={{ backgroundColor: '#faf7f2' }}>
                    <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-black block text-sm lg:text-base">Verified Providers</span>
                      <span className="text-xs lg:text-sm text-gray-800">Background checked</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl border-2 border-black" style={{ backgroundColor: '#faf7f2' }}>
                    <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-black block text-sm lg:text-base">Privacy Focused</span>
                      <span className="text-xs lg:text-sm text-gray-800">Your data protected</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl border-2 border-black" style={{ backgroundColor: '#faf7f2' }}>
                    <FileCheck className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-black block text-sm lg:text-base">2025 Compliant</span>
                      <span className="text-xs lg:text-sm text-gray-800">Up to date regulations</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/competitive-advantage">
                <Button className="font-black py-4 lg:py-6 px-8 lg:px-10 rounded-2xl text-lg lg:text-xl shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 border-2 border-black text-black" style={{ backgroundColor: '#f5d478' }}>
                  Take the Tour
                  <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* User Type Selector Section */}
        <div className="space-y-16 lg:space-y-20">
          <div className="text-center">
            <div className="inline-block relative">
              <div className="fintech-card backdrop-blur-sm rounded-3xl px-8 lg:px-10 py-6 lg:py-8 shadow-2xl relative transform hover:scale-105 transition-transform duration-300" style={{ backgroundColor: '#F5F5DC' }}>
                <div className="absolute -top-6 lg:-top-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-600 to-purple-600 rounded-full flex items-center justify-center text-cream text-xl lg:text-2xl font-black fintech-card shadow-lg">
                    {selectedOption ? (
                      <div className="text-white">
                        {selectedOption.id === 'fleet' && <Truck className="h-6 w-6 lg:h-8 lg:w-8" />}
                        {selectedOption.id === 'provider' && <Wrench className="h-6 w-6 lg:h-8 lg:w-8" />}
                        {selectedOption.id === 'customer' && <Search className="h-6 w-6 lg:h-8 lg:w-8" />}
                      </div>
                    ) : (
                      "?"
                    )}
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4 pt-4">
                  What brings you here today?
                </h2>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-medium max-w-4xl mx-auto">
                  Choose your path to get started with HOUSIE
                </p>
                <div className="absolute -bottom-8 lg:-bottom-12 left-1/2 transform -translate-x-1/2 text-4xl lg:text-5xl animate-bounce" style={{ color: '#f5d478' }}>
                  👇
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {userTypeOptions.map((option) => (
              <Card 
                key={option.id}
                className={`fintech-card cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 backdrop-blur-sm rounded-2xl p-6 lg:p-8 relative overflow-hidden ${
                  selectedUserType === option.id ? 'ring-4 ring-orange-600 shadow-2xl scale-105' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: '#f8f9fa' }}
                onClick={() => handleUserTypeSelect(option.id)}
              >
                <CardHeader className="text-center pb-6 relative z-10">
                  <div className="mx-auto mb-6 lg:mb-8 p-6 lg:p-8 fintech-card rounded-3xl w-fit shadow-xl" style={{ backgroundColor: '#faf7f2' }}>
                    {option.icon}
                  </div>
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-black text-black mb-4">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="text-gray-800 text-base sm:text-lg lg:text-xl font-medium leading-relaxed">
                    {option.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <ul className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                    {option.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 lg:gap-4">
                        <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-600 flex-shrink-0" />
                        <span className="text-black font-medium text-sm lg:text-base">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/services">
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-cream font-bold py-3 lg:py-4 rounded-2xl text-base lg:text-lg shadow-lg transform hover:scale-105 transition-all duration-200 fintech-card">
                      Choose This Path
                      <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Demo Section */}
        <div id="demo-section" className="space-y-16 lg:space-y-20">
          <div className="text-center">
            <div className="inline-block fintech-card backdrop-blur-sm px-8 lg:px-10 py-6 lg:py-8 shadow-2xl relative" style={{ backgroundColor: '#F5F5DC' }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4">
                See HOUSIE in Action
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-medium">
                {selectedOption 
                  ? `Here's what you can expect as a ${selectedOption.title.toLowerCase().replace('?', '')}`
                  : "Discover how HOUSIE connects you with trusted professionals"
                }
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="fintech-card backdrop-blur-sm p-6 lg:p-8 transform hover:scale-105 transition-transform duration-300 shadow-2xl" style={{ backgroundColor: '#f8f9fa' }}>
              <img 
                src={demoContent.demoImage} 
                alt={`${demoContent.title} Demo`}
                className="w-full h-auto rounded-2xl shadow-xl border-2 border-black"
              />
            </div>

            <div className="space-y-8">
              <div className="fintech-card backdrop-blur-sm p-8 lg:p-10 shadow-2xl" style={{ backgroundColor: '#f8f9fa' }}>
                <h3 className="text-2xl lg:text-3xl font-black text-black mb-6 lg:mb-8 flex items-center gap-3">
                  <Star className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                  {selectedOption 
                    ? `Why ${selectedOption.title.replace('?', '')} Love HOUSIE`
                    : "Why People Love HOUSIE"
                  }
                </h3>
                
                <div className="space-y-4 lg:space-y-6">
                  {demoContent.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4 lg:gap-6 p-4 lg:p-6 rounded-2xl border-2 border-black hover:shadow-lg transition-shadow duration-200" style={{ backgroundColor: '#faf7f2' }}>
                      <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-black text-black text-base lg:text-lg mb-2">{benefit}</h4>
                        <p className="text-gray-800 font-medium text-sm lg:text-base">
                          Professional tools and features designed for your success
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                <Link to="/services" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-cream font-black py-4 lg:py-6 rounded-2xl text-lg lg:text-xl shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 border-2 border-black">
                    Get Started Now
                    <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 ml-3" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="px-8 lg:px-10 py-4 lg:py-6 border-3 border-black text-black rounded-2xl font-bold hover:bg-cream/80 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  style={{ backgroundColor: '#F5F5DC' }}
                  onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing-section" className="space-y-16">
          <div className="text-center">
            <div className="inline-block fintech-card backdrop-blur-sm rounded-xl px-8 py-6 shadow-lg" style={{ backgroundColor: '#f8f9fa' }}>
              <Badge className="bg-orange-600 text-white px-4 py-2 text-sm font-bold mb-4 rounded-xl border-2 border-black">
                💰 FRAIS RÉDUITS: 6% vs 15-30% ailleurs
              </Badge>
              <h2 className="text-5xl font-black text-black mb-6">
                Tarifs <span className="text-orange-600">Transparents</span>
                <br />Sans Surprise
              </h2>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
                Choisissez le plan qui correspond à vos besoins. 
                Tous les plans incluent notre garantie de conformité CRA et nos outils fintech.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`fintech-card backdrop-blur-sm rounded-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${
                  plan.popular ? 'ring-4 ring-purple-600 shadow-2xl' : ''
                }`}
                style={{ backgroundColor: plan.bgColor }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center py-2 text-sm font-bold">
                    ⭐ PLUS POPULAIRE
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className="mx-auto mb-4 p-3 rounded-2xl w-fit shadow-lg border-2 border-black" style={{ backgroundColor: '#faf7f2' }}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-black text-black">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-800 font-medium">
                    {plan.description}
                  </CardDescription>
                  <div className="py-4">
                    <div className="text-4xl font-black text-black">
                      ${plan.price}
                      <span className="text-lg font-normal text-gray-800">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <Button className={`w-full ${plan.buttonColor} text-white font-bold py-3 rounded-xl mb-6 shadow-lg border-2 border-black`}>
                    {plan.name === "Gratuit" ? "COMMENCER GRATUIT" : "CHOISIR CE PLAN"}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-black text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedHeroSection;
