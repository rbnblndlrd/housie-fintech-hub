
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Truck, Wrench, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface UserTypeOption {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  benefits: string[];
  demoImage: string;
}

interface UserTypeSelectorProps {
  onUserTypeSelect: (userType: string) => void;
  selectedUserType: string | null;
}

export const UserTypeSelector = ({ onUserTypeSelect, selectedUserType }: UserTypeSelectorProps) => {
  const userTypeOptions: UserTypeOption[] = [
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

  const handleUserTypeSelect = (userType: string) => {
    onUserTypeSelect(userType);
    // Smooth scroll to demo section
    setTimeout(() => {
      document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Get the selected option to show the appropriate icon
  const selectedOption = userTypeOptions.find(option => option.id === selectedUserType);

  return (
    <section className="py-16 lg:py-24 px-2 sm:px-4 relative">
      {/* Subtle gradient overlay that blends with the forest green background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-700/40 via-green-600/30 to-green-500/20"></div>
      
      <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto relative">
        <div className="text-center mb-16 lg:mb-20">
          {/* Mascot Speech Bubble for Section */}
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
              {/* Pointing arrow - bright yellow */}
              <div className="absolute -bottom-8 lg:-bottom-12 left-1/2 transform -translate-x-1/2 text-4xl lg:text-5xl animate-bounce" style={{ color: '#f5d478' }}>
                👇
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16">
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
    </section>
  );
};
