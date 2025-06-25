import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, MessageCircle, BarChart3, Shield, Clock, DollarSign, Users, Zap, CheckCircle, Truck, Wrench, ArrowRight, Eye, FileCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { ChatAssistant } from "@/components/ChatAssistant";
import { PricingSection } from "@/components/PricingSection";
import { Link } from "react-router-dom";
import PopArtMascot from "@/components/PopArtMascot";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  const userTypeOptions = [
    {
      id: "fleet",
      title: "Managing a Fleet?",
      description: "Coordinate multiple service providers and manage operations efficiently",
      icon: <Truck className="h-12 w-12 text-orange-600" />,
      benefits: ["Team coordination", "Bulk scheduling", "Fleet analytics", "Revenue optimization"],
      demoImage: "/lovable-uploads/analytics-dashboard.png"
    },
    {
      id: "provider",
      title: "Looking for Work?",
      description: "Join our network of verified service providers and grow your business",
      icon: <Wrench className="h-12 w-12 text-green-600" />,
      benefits: ["Verified leads", "Flexible scheduling", "Payment protection", "Business tools"],
      demoImage: "/lovable-uploads/housiepro.png"
    },
    {
      id: "customer",
      title: "Need a Local Expert?",
      description: "Find trusted, verified professionals for your home and business needs",
      icon: <Search className="h-12 w-12 text-purple-600" />,
      benefits: ["Verified professionals", "Instant booking", "Secure payments", "Privacy focused"],
      demoImage: "/lovable-uploads/browse-services(broken).png"
    }
  ];

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
    // Smooth scroll to demo section
    setTimeout(() => {
      document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const selectedOption = userTypeOptions.find(option => option.id === selectedUserType);

  return (
    <div className="min-h-screen relative" style={{
      background: `
        radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at top right, rgba(45, 27, 105, 0.2) 0%, transparent 50%),
        radial-gradient(ellipse at bottom left, rgba(30, 41, 59, 0.25) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(234, 88, 12, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #2d1b69 50%, #1a1a1a 100%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      <Header />
      
      {/* Subtle overlay pattern for additional depth */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          radial-gradient(circle at 25px 25px, rgba(139, 92, 246, 0.4) 2px, transparent 0),
          radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.2) 2px, transparent 0)
        `,
        backgroundSize: '100px 100px'
      }}></div>
      
      {/* Hero Section with Enhanced Width Usage */}
      <section className="pt-20 pb-20 px-2 sm:px-4 relative overflow-hidden">
        {/* Additional dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">
            {/* Left Side - Enhanced Mascot */}
            <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                {/* Mascot with enhanced styling */}
                <div className="relative transform hover:scale-105 transition-all duration-300">
                  <PopArtMascot className="w-56 h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80" />
                  
                  {/* Animated rings around mascot */}
                  <div className="absolute inset-0 rounded-full border-4 border-cream/30 animate-pulse opacity-50"></div>
                  <div className="absolute inset-4 rounded-full border-2 border-cream/20 animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Enhanced Speech Bubble */}
                <div className="absolute -top-16 lg:-top-20 -right-4 lg:-right-16 bg-cream/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border-2 border-black transform rotate-2 hover:rotate-0 transition-transform duration-300 max-w-xs lg:max-w-sm">
                  <div className="text-lg lg:text-xl font-black text-black">
                    Need a local expert? 🔍
                  </div>
                  <div className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-cream/95"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Hero Content with Better Width Usage */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-cream leading-tight drop-shadow-2xl">
                    Connect with<br />
                    <span className="text-orange-300 drop-shadow-lg">
                      Professionals
                    </span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl lg:text-2xl text-cream/90 font-medium leading-relaxed drop-shadow-lg max-w-2xl">
                    Connect with verified professionals in your area. Safe, secure, and guaranteed.
                  </p>
                </div>
                
                {/* Enhanced Value Props Card with Better Spacing */}
                <div className="bg-cream/95 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border-3 border-black shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <h2 className="text-xl lg:text-2xl font-black text-black mb-6 flex items-center gap-3">
                    <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                    Why Choose HOUSIE?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-cream/80 rounded-xl border-2 border-black">
                      <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-black block text-sm lg:text-base">Escrow Protection</span>
                        <span className="text-xs lg:text-sm text-gray-800">Your money is safe</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-cream/80 rounded-xl border-2 border-black">
                      <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-black block text-sm lg:text-base">Verified Providers</span>
                        <span className="text-xs lg:text-sm text-gray-800">Background checked</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-cream/80 rounded-xl border-2 border-black">
                      <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-black block text-sm lg:text-base">Privacy Focused</span>
                        <span className="text-xs lg:text-sm text-gray-800">Your data protected</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-cream/80 rounded-xl border-2 border-black">
                      <FileCheck className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-black block text-sm lg:text-base">2025 Compliant</span>
                        <span className="text-xs lg:text-sm text-gray-800">Up to date regulations</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 lg:py-6 px-8 lg:px-10 rounded-2xl text-lg lg:text-xl shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 border-2 border-black">
                  Take the Tour
                  <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Selection Wizard - Full Width Usage */}
      <section className="py-16 lg:py-24 px-2 sm:px-4 relative">
        {/* Background overlay for readability */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto relative">
          <div className="text-center mb-16 lg:mb-20">
            {/* Mascot Speech Bubble for Section */}
            <div className="inline-block relative">
              <div className="bg-cream/95 backdrop-blur-sm rounded-3xl px-8 lg:px-10 py-6 lg:py-8 border-3 border-black shadow-2xl relative transform hover:scale-105 transition-transform duration-300">
                <div className="absolute -top-6 lg:-top-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-600 to-purple-600 rounded-full flex items-center justify-center text-cream text-xl lg:text-2xl font-black border-2 border-black shadow-lg">
                    ?
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4 pt-4">
                  What brings you here today?
                </h2>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-medium max-w-4xl mx-auto">
                  Choose your path to get started with HOUSIE
                </p>
                {/* Pointing arrow */}
                <div className="absolute -bottom-8 lg:-bottom-12 left-1/2 transform -translate-x-1/2 text-4xl lg:text-5xl animate-bounce">
                  👇
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16">
            {userTypeOptions.map((option) => (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 bg-cream/95 backdrop-blur-sm border-3 border-black rounded-2xl p-6 lg:p-8 relative overflow-hidden ${
                  selectedUserType === option.id ? 'ring-4 ring-orange-600 shadow-2xl scale-105' : 'hover:scale-105'
                }`}
                onClick={() => handleUserTypeSelect(option.id)}
              >
                <CardHeader className="text-center pb-6 relative z-10">
                  <div className="mx-auto mb-6 lg:mb-8 p-4 lg:p-6 bg-cream rounded-3xl w-fit border-2 border-black shadow-lg">
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

                  <Button className="w-full bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-cream font-bold py-3 lg:py-4 rounded-2xl text-base lg:text-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-black">
                    Choose This Path
                    <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section - Full Width */}
      {selectedOption && (
        <section id="demo-section" className="py-16 lg:py-24 px-2 sm:px-4 relative">
          {/* Background overlay for readability */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto relative">
            <div className="text-center mb-16 lg:mb-20">
              <div className="inline-block bg-cream/95 backdrop-blur-sm rounded-3xl px-8 lg:px-10 py-6 lg:py-8 border-3 border-black shadow-2xl relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4">
                  See HOUSIE in Action
                </h2>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-medium">
                  Here's what you can expect as a {selectedOption.title.toLowerCase().replace('?', '')}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Demo Screenshot */}
              <div className="bg-cream/95 backdrop-blur-sm rounded-3xl border-3 border-black shadow-2xl p-6 lg:p-8 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src={selectedOption.demoImage} 
                  alt={`${selectedOption.title} Demo`}
                  className="w-full h-auto rounded-2xl shadow-xl border-2 border-black"
                />
              </div>

              {/* Demo Benefits */}
              <div className="space-y-8">
                <div className="bg-cream/95 backdrop-blur-sm rounded-3xl border-3 border-black shadow-2xl p-8 lg:p-10">
                  <h3 className="text-2xl lg:text-3xl font-black text-black mb-6 lg:mb-8 flex items-center gap-3">
                    <Star className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                    Why {selectedOption.title.replace('?', '')} Love HOUSIE
                  </h3>
                  
                  <div className="space-y-4 lg:space-y-6">
                    {selectedOption.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-4 lg:gap-6 p-4 lg:p-6 bg-cream/80 rounded-2xl border-2 border-black hover:shadow-lg transition-shadow duration-200">
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
                    className="px-8 lg:px-10 py-4 lg:py-6 border-3 border-black bg-cream text-black rounded-2xl font-bold hover:bg-cream/80 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Pricing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Pricing Section - Full Width */}
      <div id="pricing-section" className="relative">
        {/* Background overlay for readability */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Mascot pointing to best value */}
        <div className="absolute top-24 lg:top-32 left-8 lg:left-16 z-20 hidden lg:block">
          <div className="bg-cream/95 backdrop-blur-sm rounded-2xl px-6 lg:px-8 py-4 lg:py-6 border-3 border-black shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-300">
            <div className="text-base lg:text-lg font-black text-black flex items-center gap-2">
              <Star className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
              Best Value! 👆
            </div>
          </div>
        </div>
        <PricingSection />
      </div>

      <ChatAssistant />
    </div>
  );
};

export default Index;
