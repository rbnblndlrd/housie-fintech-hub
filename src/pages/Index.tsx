
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50">
      <Header />
      
      {/* Hero Section with Mascot */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Mascot */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative">
                <PopArtMascot className="transform hover:scale-105 transition-transform duration-300" />
                {/* Speech Bubble */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl px-6 py-4 shadow-lg border-2 border-black">
                  <div className="text-lg font-bold text-gray-800">
                    Welcome to HOUSIE! 👋
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-black"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                  Find Local<br />
                  <span className="text-transparent bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text">
                    Experts
                  </span>
                </h1>
                
                <div className="bg-white rounded-xl p-6 border-2 border-black shadow-lg">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Why Choose HOUSIE?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-green-500" />
                      <span className="font-medium">Escrow Protection</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span className="font-medium">Verified Providers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="h-6 w-6 text-green-500" />
                      <span className="font-medium">Quality Guarantee</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-green-500" />
                      <span className="font-medium">24/7 Support</span>
                    </div>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                  Take the Tour
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Selection Wizard */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="inline-block bg-white rounded-2xl px-8 py-6 border-2 border-black shadow-lg relative">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                What brings you here today?
              </h2>
              <p className="text-xl text-gray-600">
                Choose your path to get started with HOUSIE
              </p>
              {/* Mascot pointing arrow */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">
                👇
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {userTypeOptions.map((option) => (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white border-2 border-black rounded-xl p-6 ${
                  selectedUserType === option.id ? 'ring-4 ring-orange-400 shadow-2xl' : ''
                }`}
                onClick={() => handleUserTypeSelect(option.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-6 p-4 bg-gray-50 rounded-2xl w-fit">
                    {option.icon}
                  </div>
                  <CardTitle className="text-2xl font-black text-gray-900">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    {option.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {option.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl">
                    Choose This Path
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      {selectedOption && (
        <section id="demo-section" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-white rounded-2xl px-8 py-6 border-2 border-black shadow-lg">
                <h2 className="text-4xl font-black text-gray-900 mb-4">
                  See HOUSIE in Action
                </h2>
                <p className="text-xl text-gray-600">
                  Here's what you can expect as a {selectedOption.title.toLowerCase().replace('?', '')}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Demo Screenshot */}
              <div className="bg-white rounded-xl border-2 border-black shadow-lg p-6">
                <img 
                  src={selectedOption.demoImage} 
                  alt={`${selectedOption.title} Demo`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>

              {/* Demo Benefits */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border-2 border-black shadow-lg p-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">
                    Why {selectedOption.title.replace('?', '')} Love HOUSIE
                  </h3>
                  
                  <div className="space-y-4">
                    {selectedOption.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-800">{benefit}</h4>
                          <p className="text-gray-600 text-sm mt-1">
                            Professional tools and features designed for your success
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/services" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg">
                      Get Started Now
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="px-8 py-4 border-2 border-black rounded-xl font-bold hover:bg-gray-50"
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
        <div className="absolute top-20 left-8 z-10 hidden lg:block">
          <div className="bg-white rounded-2xl px-6 py-4 border-2 border-black shadow-lg">
            <div className="text-sm font-bold text-gray-800">
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
