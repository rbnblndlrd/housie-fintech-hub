
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface UserTypeOption {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  benefits: string[];
  demoImage: string;
}

interface DemoSectionProps {
  selectedOption: UserTypeOption | undefined;
}

export const DemoSection = ({ selectedOption }: DemoSectionProps) => {
  if (!selectedOption) return null;

  return (
    <section id="demo-section" className="py-16 lg:py-24 px-2 sm:px-4 relative">
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto relative">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-block backdrop-blur-sm rounded-3xl px-8 lg:px-10 py-6 lg:py-8 border-3 border-black shadow-2xl relative" style={{ backgroundColor: '#F5F5DC' }}>
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
          <div className="backdrop-blur-sm rounded-3xl border-3 border-black shadow-2xl p-6 lg:p-8 transform hover:scale-105 transition-transform duration-300" style={{ backgroundColor: '#F5F5DC' }}>
            <img 
              src={selectedOption.demoImage} 
              alt={`${selectedOption.title} Demo`}
              className="w-full h-auto rounded-2xl shadow-xl border-2 border-black"
            />
          </div>

          {/* Demo Benefits */}
          <div className="space-y-8">
            <div className="backdrop-blur-sm rounded-3xl border-3 border-black shadow-2xl p-8 lg:p-10" style={{ backgroundColor: '#F5F5DC' }}>
              <h3 className="text-2xl lg:text-3xl font-black text-black mb-6 lg:mb-8 flex items-center gap-3">
                <Star className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                Why {selectedOption.title.replace('?', '')} Love HOUSIE
              </h3>
              
              <div className="space-y-4 lg:space-y-6">
                {selectedOption.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 lg:gap-6 p-4 lg:p-6 rounded-2xl border-2 border-black hover:shadow-lg transition-shadow duration-200" style={{ backgroundColor: '#F5F5DC' }}>
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
    </section>
  );
};
