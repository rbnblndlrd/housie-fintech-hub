
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowRight, CheckCircle, Shield, Lock, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface UserTypeSelectorProps {
  onUserTypeSelect: (userType: string) => void;
  selectedUserType: string | null;
}

export const UserTypeSelector = ({ onUserTypeSelect, selectedUserType }: UserTypeSelectorProps) => {
  const handleCustomerSelect = () => {
    onUserTypeSelect("customer");
    // Smooth scroll to demo section
    setTimeout(() => {
      document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const trustFeatures = [
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
  ];

  return (
    <section className="py-16 lg:py-24 px-2 sm:px-4 relative">
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto relative">
        <div className="text-center mb-16 lg:mb-20">
          {/* Main Hero Section */}
          <div className="inline-block relative">
            <div className="fintech-card backdrop-blur-sm rounded-3xl px-8 lg:px-12 py-8 lg:py-12 shadow-2xl relative transform hover:scale-105 transition-transform duration-300" style={{ backgroundColor: '#F5F5DC' }}>
              <div className="absolute -top-8 lg:-top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-600 to-purple-600 rounded-full flex items-center justify-center text-cream shadow-lg">
                  <Search className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-6 pt-6">
                Montreal's Safest <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-600">
                  Service Platform
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-800 font-medium max-w-4xl mx-auto mb-8">
                Find trusted, verified professionals for your home and business needs
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-800">Background Checked</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-800">Payment Protected</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-800">Licensed Professionals</span>
                </div>
              </div>

              {/* Main CTA */}
              <Link to="/services">
                <Button className="bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white font-bold py-4 px-8 lg:py-6 lg:px-12 rounded-2xl text-lg lg:text-xl shadow-xl transform hover:scale-105 transition-all duration-200 fintech-card">
                  Find Trusted Services Now
                  <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 ml-3" />
                </Button>
              </Link>

              {/* Pointing arrow */}
              <div className="absolute -bottom-8 lg:-bottom-12 left-1/2 transform -translate-x-1/2 text-4xl lg:text-5xl animate-bounce" style={{ color: '#f5d478' }}>
                👇
              </div>
            </div>
          </div>
        </div>

        {/* Trust Features Section */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-16">
          {trustFeatures.map((feature, index) => (
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

        {/* Secondary CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-white/90 mb-6 font-medium">
            Join thousands of satisfied customers who trust HOUSIE
          </p>
          <Link to="/services">
            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold py-3 px-6 rounded-xl backdrop-blur-sm">
              Browse All Services
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
