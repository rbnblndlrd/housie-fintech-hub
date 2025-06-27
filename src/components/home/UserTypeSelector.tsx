
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Truck, Briefcase, ArrowRight, CheckCircle, Shield, Lock, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface UserTypeSelectorProps {
  onUserTypeSelect: (userType: string) => void;
  selectedUserType: string | null;
}

export const UserTypeSelector = ({ onUserTypeSelect, selectedUserType }: UserTypeSelectorProps) => {
  const handleUserTypeSelect = (userType: string) => {
    onUserTypeSelect(userType);
    // Smooth scroll to demo section
    setTimeout(() => {
      document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const userTypes = [
    {
      id: "customer",
      title: "Need a Local Expert?",
      subtitle: "Find trusted professionals",
      description: "Get quality services from verified providers in Montreal",
      icon: <Search className="h-8 w-8 text-orange-600" />,
      color: "from-orange-600 to-red-600",
      features: ["Background-checked providers", "Payment protection", "Licensed professionals"]
    },
    {
      id: "provider",
      title: "Looking for Work?",
      subtitle: "Join our network",
      description: "Connect with customers and grow your business",
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      color: "from-blue-600 to-purple-600",
      features: ["Flexible scheduling", "Secure payments", "Growing customer base"]
    },
    {
      id: "fleet",
      title: "Managing a Fleet?",
      subtitle: "Enterprise solutions",
      description: "Optimize operations and track performance",
      icon: <Truck className="h-8 w-8 text-green-600" />,
      color: "from-green-600 to-teal-600",
      features: ["Real-time tracking", "Analytics dashboard", "Route optimization"]
    }
  ];

  return (
    <section className="py-16 lg:py-24 px-2 sm:px-4 relative">
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto relative">
        <div className="text-center mb-16 lg:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Choose Your Path
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-medium max-w-4xl mx-auto">
            Whether you need services, provide them, or manage a team - we've got you covered
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {userTypes.map((type) => (
            <Card 
              key={type.id}
              className={`fintech-card backdrop-blur-sm cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                selectedUserType === type.id ? 'ring-4 ring-white/50' : ''
              }`}
              onClick={() => handleUserTypeSelect(type.id)}
              style={{ backgroundColor: '#F5F5DC' }}
            >
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-4 fintech-card rounded-2xl w-fit shadow-lg bg-white">
                  {type.icon}
                </div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-black text-black mb-2">
                  {type.title}
                </CardTitle>
                <CardDescription className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  {type.subtitle}
                </CardDescription>
                <p className="text-gray-700 text-base sm:text-lg font-medium mb-6">
                  {type.description}
                </p>
                
                {/* Features list */}
                <div className="space-y-3">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-left">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  className={`w-full bg-gradient-to-r ${type.color} hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200`}
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust section for customers */}
        {selectedUserType === 'customer' && (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-16">
            {[
              {
                icon: <Shield className="h-6 w-6 text-green-600" />,
                title: "Background-checked providers only",
                description: "Every professional verified and screened"
              },
              {
                icon: <Lock className="h-6 w-6 text-blue-600" />,
                title: "Payment protected until work complete",
                description: "Secure escrow system protects your payment"
              },
              {
                icon: <Award className="h-6 w-6 text-purple-600" />,
                title: "Licensed professionals verified",
                description: "All credentials checked and confirmed"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="fintech-card backdrop-blur-sm rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                style={{ backgroundColor: '#F5F5DC' }}
              >
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 p-4 fintech-card rounded-2xl w-fit shadow-lg bg-white">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-black text-black mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-800 text-base sm:text-lg font-medium">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-lg text-white/90 mb-6 font-medium">
            Join thousands of satisfied users who trust HOUSIE
          </p>
          <Link to="/services">
            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold py-3 px-6 rounded-xl backdrop-blur-sm">
              Explore Services
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
