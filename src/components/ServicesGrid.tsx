
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SampleDataSeeder from "@/components/SampleDataSeeder";
import ServiceCard from "@/components/ServiceCard";

interface Service {
  id: string;
  title: string;
  description: string;
  base_price: number;
  pricing_type: string;
  category: string;
  subcategory: string;
  active: boolean;
  provider: {
    id: string;
    business_name: string;
    hourly_rate: number;
    service_radius_km: number;
    average_rating: number;
    total_bookings: number;
    verified: boolean;
    user: {
      full_name: string;
      city: string;
      province: string;
    };
  };
}

interface ServicesGridProps {
  services: Service[];
  filteredServices: Service[];
  isLoading: boolean;
  fallbackServices: Service[];
  onBookNow: (service: Service) => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  filteredServices,
  isLoading,
  fallbackServices,
  onBookNow
}) => {
  return (
    <div className="lg:col-span-3">
      {/* Sample Data Seeder - Show when no real services from DB */}
      {!isLoading && services.length === fallbackServices.length && (
        <SampleDataSeeder />
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-800 dark:text-gray-700">Chargement des services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
          <CardContent className="p-12 text-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 inline-block mb-6">
              <svg className="h-16 w-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun service trouvé</h3>
            <p className="text-gray-700 mt-2">Essayez de modifier vos critères de recherche</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesGrid;
