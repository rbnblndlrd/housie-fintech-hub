
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  DollarSign, 
  Shield, 
  Award, 
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Camera
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  pricingType: 'hourly' | 'fixed';
  category: string;
  responseTime: string;
  emergency: boolean;
  images?: string[];
}

interface ProviderServiceGalleryProps {
  services: Service[];
  providerInfo: {
    businessName: string;
    description: string;
    phone?: string;
    email?: string;
    serviceAreas: string[];
    yearsExperience: number;
    responseTime: string;
    emergencyService: boolean;
    certifications: string[];
    insurance: boolean;
    backgroundCheck: boolean;
  };
  onBookService: (serviceId: string) => void;
}

const ProviderServiceGallery: React.FC<ProviderServiceGalleryProps> = ({
  services,
  providerInfo,
  onBookService
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Provider Information Card */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="text-xl">About {providerInfo.businessName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {providerInfo.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span><strong>{providerInfo.yearsExperience}</strong> years in business</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>Typical response: <strong>{providerInfo.responseTime}</strong></span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <span>Serves: <strong>{providerInfo.serviceAreas.join(', ')}</strong></span>
                </div>
              </div>
            </div>

            <div>
              {/* Contact Information */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Contact</h4>
                <div className="space-y-2">
                  {providerInfo.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span>{providerInfo.phone}</span>
                    </div>
                  )}
                  {providerInfo.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span>{providerInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Badges */}
              <div>
                <h4 className="font-semibold mb-2">Verification & Trust</h4>
                <div className="flex flex-wrap gap-2">
                  {providerInfo.insurance && (
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Insured
                    </Badge>
                  )}
                  {providerInfo.backgroundCheck && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Award className="h-3 w-3 mr-1" />
                      Background Checked
                    </Badge>
                  )}
                  {providerInfo.emergencyService && (
                    <Badge className="bg-red-100 text-red-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Emergency Service
                    </Badge>
                  )}
                  {providerInfo.certifications.map((cert, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Services Offered</h3>
          
          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="fintech-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Service Images */}
                {service.images && service.images.length > 0 && (
                  <div className="mb-4 relative">
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {service.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        +{service.images.length - 1}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{service.title}</h4>
                      <Badge className="mt-1 capitalize">{service.category}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                        <DollarSign className="h-4 w-4" />
                        {service.basePrice}
                        {service.pricingType === 'hourly' ? '/hr' : ''}
                      </div>
                      <span className="text-xs text-gray-500">
                        {service.pricingType === 'hourly' ? 'Per hour' : 'Fixed price'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.responseTime}
                    </div>
                    {service.emergency && (
                      <Badge variant="secondary" className="text-xs">
                        Emergency Available
                      </Badge>
                    )}
                  </div>

                  <Button 
                    onClick={() => onBookService(service.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Book This Service
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card className="fintech-card">
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No services found in this category.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProviderServiceGallery;
