
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SampleDataSeeder from "@/components/SampleDataSeeder";
import ServiceCard from "@/components/ServiceCard";
import { Service } from "@/types/service";

interface ServicesGridProps {
  services: Service[];
  filteredServices: Service[];
  isLoading: boolean;
  fallbackServices: Service[];
  onBookNow: (service: Service) => void;
  onHoverProvider?: (providerId: string | null) => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  filteredServices,
  isLoading,
  onBookNow,
  onHoverProvider
}) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Sample Data Seeder - Always use fintech styling */}
      {!isLoading && services.length === 0 && (
        <div className="mb-8">
          <SampleDataSeeder />
        </div>
      )}

      {isLoading ? (
        <div className="fintech-card text-center py-16">
          <div className="p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-800 dark:text-gray-200 font-medium">Chargement des services...</p>
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="fintech-card text-center py-16">
          <div className="p-8 space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 inline-block mb-8">
              <svg className="h-20 w-20 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Aucun service trouvé</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Essayez de modifier vos critères de recherche</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBookNow={onBookNow}
              onHoverProvider={onHoverProvider}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesGrid;
