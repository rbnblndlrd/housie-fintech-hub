
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Shield } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  base_price: number;
  pricing_type: string;
  background_check_required: boolean;
  ccq_rbq_required: boolean;
}

interface ProviderServicesListProps {
  services: Service[];
  providerHourlyRate: number;
  providerName: string;
  onBookNow?: (service: Service) => void;
}

const ProviderServicesList: React.FC<ProviderServicesListProps> = ({ 
  services, 
  providerHourlyRate, 
  providerName,
  onBookNow 
}) => {
  const handleBookNow = (service: Service) => {
    // Call the parent handler directly for booking confirmation
    if (onBookNow) {
      onBookNow(service);
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Available Services</CardTitle>
      </CardHeader>
      <CardContent>
        {services && services.length > 0 ? (
          <div className="grid gap-6">
            {services.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-900">
                          {service.pricing_type === 'hourly' 
                            ? `${providerHourlyRate}$/hour`
                            : `${service.base_price}$ fixed`
                          }
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">+ 6% HOUSIE fee</span>
                      </div>
                    </div>

                    {(service.background_check_required || service.ccq_rbq_required) && (
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600 font-medium">
                          {service.background_check_required && 'Background Check Required'}
                          {service.background_check_required && service.ccq_rbq_required && ' • '}
                          {service.ccq_rbq_required && 'Professional License Required'}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => handleBookNow(service)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderServicesList;
