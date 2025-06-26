
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Truck, Wrench } from 'lucide-react';

interface DemoOption {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  benefits: string[];
  demoImage: string;
}

interface DemoSectionProps {
  selectedOption: DemoOption | undefined;
}

export const DemoSection: React.FC<DemoSectionProps> = ({ selectedOption }) => {
  if (!selectedOption) return null;

  const getIconForOption = (optionId: string) => {
    switch (optionId) {
      case 'fleet':
        return <Truck className="h-8 w-8 text-orange-600" />;
      case 'provider':
        return <Wrench className="h-8 w-8 text-green-600" />;
      case 'customer':
        return <Search className="h-8 w-8 text-purple-600" />;
      default:
        return <Search className="h-8 w-8 text-purple-600" />;
    }
  };

  return (
    <section id="demo-section" className="py-16 lg:py-24 px-2 sm:px-4 bg-gray-800">
      <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            {getIconForOption(selectedOption.id)}
            <h2 className="text-3xl lg:text-4xl font-black text-cream">
              {selectedOption.title.replace('?', '')} Demo
            </h2>
          </div>
          <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
            See how HOUSIE works for your specific needs
          </p>
        </div>

        <Card className="bg-cream border-3 border-black rounded-2xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-100 rounded-2xl m-4 overflow-hidden border-2 border-black">
              <img
                src={selectedOption.demoImage}
                alt={`${selectedOption.title} Demo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gray-200">
                        <div class="text-center">
                          <div class="mb-4">${selectedOption.icon}</div>
                          <h3 class="text-xl font-bold text-gray-800 mb-2">${selectedOption.title}</h3>
                          <p class="text-gray-600">${selectedOption.description}</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            
            <div className="p-6 lg:p-8">
              <h3 className="text-2xl lg:text-3xl font-black text-black mb-4">
                Perfect for {selectedOption.title.toLowerCase().replace('?', '')}
              </h3>
              <p className="text-gray-800 text-lg mb-6">
                {selectedOption.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {selectedOption.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-black font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
