
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, MessageCircle, BarChart3, Shield, Clock, DollarSign, Users, Zap, CheckCircle, Truck, Wrench, ArrowRight } from "lucide-react";
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
      icon: <Truck className="h-12 w-12 text-blue-600" />,
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
      benefits: ["Verified professionals", "Instant booking", "Secure payments", "Quality guarantee"],
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
      backgroundImage: `url('/lovable-uploads/a98e4703-b9ee-42e9-b838-dfa246ee2aa8.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'scroll'
    }}>
      <Header />
      
      {/* Hero Section with Sunset Gradient */}
      <section className="pt-20 pb-20 px-4 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b9d 50%, #c44569 75%, #6c5ce7 100%)'
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2px, transparent 0)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Enhanced Mascot */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative">
                {/* Mascot with enhanced styling */}
                <div className="relative transform hover:scale-105 transition-all duration-300">
                  <PopArtMascot className="w-48 h-48 lg:w-56 lg:h-56" />
                  
                  {/* Animated rings around mascot */}
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse opacity-50"></div>
                  <div className="absolute inset-4 rounded-full border-2 border-white/20 animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Enhanced Speech Bubble */}
                <div className="absolute -top-20 -right-8 lg:-right-16 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border-2 border-white/50 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="text-lg font-black text-gray-800">
                    Welcome to HOUSIE! 👋
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Let's find you the perfect match!
                  </div>
                  <div className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/50"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                    Find Local<br />
                    <span className="text-yellow-300 drop-shadow-lg">
                      Experts
                    </span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-white/90 font-medium leading-relaxed drop-shadow-lg">
                    Connect with verified professionals in your area. Safe, secure, and guaranteed.
                  </p>
                </div>
                
                {/* Enhanced Value Props Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                    <Shield className="h-8 w-8 text-orange-500" />
                    Why Choose HOUSIE?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <Shield className="h-8 w-8 text-green-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-800 block">Escrow Protection</span>
                        <span className="text-sm text-gray-600">Your money is safe</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <CheckCircle className="h-8 w-8 text-blue-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-800 block">Verified Providers</span>
                        <span className="text-sm text-gray-600">Background checked</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <Star className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-800 block">Quality Guarantee</span>
                        <span className="text-sm text-gray-600">100% satisfaction</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <Clock className="h-8 w-8 text-purple-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-gray-800 block">24/7 Support</span>
                        <span className="text-sm text-gray-600">Always here to help</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-black py-6 px-10 rounded-2xl text-xl shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 border-2 border-white/30 hover:border-white/50">
                  Take the Tour
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Selection Wizard */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            {/* Mascot Speech Bubble for Section */}
            <div className="inline-block relative">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl px-10 py-8 border-2 border-black shadow-2xl relative transform hover:scale-105 transition-transform duration-300">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-black border-2 border-black shadow-lg">
                    ?
                  </div>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 pt-4">
                  What brings you here today?
                </h2>
                <p className="text-xl lg:text-2xl text-gray-600 font-medium">
                  Choose your path to get started with HOUSIE
                </p>
                {/* Pointing arrow */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-5xl animate-bounce">
                  👇
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
            {userTypeOptions.map((option) => (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 bg-white/95 backdrop-blur-sm border-2 border-black rounded-2xl p-8 relative overflow-hidden ${
                  selectedUserType === option.id ? 'ring-4 ring-orange-400 shadow-2xl scale-105' : 'hover:scale-105'
                }`}
                onClick={() => handleUserTypeSelect(option.id)}
              >
                {/* Card background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-50"></div>
                
                <CardHeader className="text-center pb-6 relative z-10">
                  <div className="mx-auto mb-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl w-fit border border-gray-200 shadow-lg">
                    {option.icon}
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl font-black text-gray-900 mb-4">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg lg:text-xl font-medium leading-relaxed">
                    {option.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <ul className="space-y-4 mb-8">
                    {option.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-4">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200 border border-black">
                    Choose This Path
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      {selectedOption && (
        <section id="demo-section" className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-20">
              <div className="inline-block bg-white/95 backdrop-blur-sm rounded-3xl px-10 py-8 border-2 border-black shadow-2xl relative">
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                  See HOUSIE in Action
                </h2>
                <p className="text-xl lg:text-2xl text-gray-600 font-medium">
                  Here's what you can expect as a {selectedOption.title.toLowerCase().replace('?', '')}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Demo Screenshot */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-black shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src={selectedOption.demoImage} 
                  alt={`${selectedOption.title} Demo`}
                  className="w-full h-auto rounded-2xl shadow-xl border border-gray-200"
                />
              </div>

              {/* Demo Benefits */}
              <div className="space-y-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-black shadow-2xl p-10">
                  <h3 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <Star className="h-8 w-8 text-orange-500" />
                    Why {selectedOption.title.replace('?', '')} Love HOUSIE
                  </h3>
                  
                  <div className="space-y-6">
                    {selectedOption.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                        <CheckCircle className="h-8 w-8 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-black text-gray-800 text-lg mb-2">{benefit}</h4>
                          <p className="text-gray-600 font-medium">
                            Professional tools and features designed for your success
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6">
                  <Link to="/services" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-black py-6 rounded-2xl text-xl shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 border-2 border-black">
                      Get Started Now
                      <ArrowRight className="h-6 w-6 ml-3" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="px-10 py-6 border-2 border-black rounded-2xl font-bold hover:bg-gray-50 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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

      {/* Enhanced Pricing Section */}
      <div id="pricing-section" className="relative">
        {/* Mascot pointing to best value */}
        <div className="absolute top-32 left-16 z-20 hidden lg:block">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-6 border-2 border-black shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-300">
            <div className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Star className="h-6 w-6 text-orange-500" />
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
