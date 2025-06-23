
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SampleDataSeeder from "@/components/SampleDataSeeder";
import ModernServiceCard from "@/components/ModernServiceCard";
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
  fallbackServices,
  onBookNow,
  onHoverProvider
}) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Sample Data Seeder - Show when no real services from DB */}
      {!isLoading && services.length === fallbackServices.length && (
        <div className="mb-8">
          <SampleDataSeeder />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-800 dark:text-gray-700 font-medium">Chargement des services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <Card className="fintech-card text-center py-16">
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 inline-block mb-8">
              <svg className="h-20 w-20 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">Aucun service trouvé</h3>
              <p className="text-gray-600 text-lg">Essayez de modifier vos critères de recherche</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredServices.map((service) => (
            <ModernServiceCard
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
