
import { useState } from "react";
import { Star } from "lucide-react";
import Header from "@/components/Header";
import { ChatAssistant } from "@/components/ChatAssistant";
import { PricingSection } from "@/components/PricingSection";
import { HeroSection } from "@/components/home/HeroSection";
import { UserTypeSelector } from "@/components/home/UserTypeSelector";
import { DemoSection } from "@/components/home/DemoSection";
import { Search, Truck, Wrench } from "lucide-react";

const Index = () => {
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
      
      <HeroSection />
      
      <UserTypeSelector 
        onUserTypeSelect={handleUserTypeSelect}
        selectedUserType={selectedUserType}
      />

      <DemoSection selectedOption={selectedOption} />

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
