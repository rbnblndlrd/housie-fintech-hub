
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle, Eye, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PopArtMascot from "@/components/PopArtMascot";

export const HeroSection = () => {
  return (
    <section className="pt-20 pb-20 px-2 sm:px-4 relative overflow-hidden bg-green-700">
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
              <div className="absolute -top-16 lg:-top-20 -right-4 lg:-right-16 bg-cream rounded-2xl px-6 py-4 shadow-2xl border-2 border-black transform rotate-2 hover:rotate-0 transition-transform duration-300 max-w-xs lg:max-w-sm">
                <div className="text-lg lg:text-xl font-black text-black flex items-center gap-2">
                  Need a local expert? 
                  <div className="text-orange-400">👉</div>
                </div>
                <div className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-cream"></div>
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
              <div className="bg-cream rounded-2xl p-6 lg:p-8 border-3 border-black shadow-2xl hover:shadow-3xl transition-all duration-300">
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

              <Link to="/services">
                <Button className="bg-orange-400 hover:bg-orange-500 text-black font-black py-4 lg:py-6 px-8 lg:px-10 rounded-2xl text-lg lg:text-xl shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 border-2 border-black">
                  Take the Tour
                  <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
