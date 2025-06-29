
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle, Eye, FileCheck, Search, Truck, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { UserTypeSelector } from './UserTypeSelector';
import DemoSection from './DemoSection';
import { PricingSection } from '../PricingSection';

interface UnifiedHeroSectionProps {
  onUserTypeSelect: (userType: string) => void;
  selectedUserType: string | null;
}

const UnifiedHeroSection: React.FC<UnifiedHeroSectionProps> = ({ 
  onUserTypeSelect, 
  selectedUserType 
}) => {
  console.log('🎯 UnifiedHeroSection rendering with:', { selectedUserType });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-green-800 to-green-700 relative overflow-hidden">
      {/* Forest green gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/70 to-green-700/60"></div>
      
      {/* Hero Section */}
      <section className="relative">
        {/* Full-width container with no outer margins */}
        <div className="w-full relative px-2 py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">
            {/* Left Side - Hero Mascot/Visual positioned close to left edge */}
            <div className="relative flex justify-start lg:justify-start order-2 lg:order-1 pl-2">
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
                    
                    {/* Animated background texture */}
                    <div className="absolute inset-0 -z-20 opacity-20">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-amber-50/10 to-transparent animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-transparent via-orange-300/10 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
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

            {/* Right Side - Enhanced Hero Content */}
            <div className="space-y-8 order-1 lg:order-2 pr-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                    Connect with<br />
                    <span className="text-orange-300 drop-shadow-lg">
                      Professionals
                    </span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-medium leading-relaxed drop-shadow-lg">
                    Connect with verified professionals in your area. Safe, secure, and guaranteed.
                  </p>
                </div>
                
                {/* Enhanced Value Props Card with Cream Background */}
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
          <div className="mt-16 w-full">
            <UserTypeSelector 
              onUserTypeSelect={onUserTypeSelect}
              selectedUserType={selectedUserType}
            />
          </div>
        </div>
      </section>

      {/* Demo Section - Show after user type selection */}
      {selectedUserType && (
        <DemoSection 
          selectedOption={userTypeOptions.find(option => option.id === selectedUserType)}
        />
      )}

      {/* Pricing Section */}
      <div id="pricing-section">
        <PricingSection />
      </div>
    </div>
  );
};

// User type options for demo section - Fixed to include required icon property
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

export default UnifiedHeroSection;
