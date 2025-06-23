
import React from 'react';
import ModernServiceCard from "@/components/ModernServiceCard";
import { Service } from "@/types/service";

interface ModernServicesGridProps {
  services: Service[];
  filteredServices: Service[];
  isLoading: boolean;
  onBookNow: (service: Service) => void;
  onHoverProvider?: (providerId: string | null) => void;
  verifiedOnly: boolean;
}

const ModernServicesGrid: React.FC<ModernServicesGridProps> = ({
  filteredServices,
  isLoading,
  onBookNow,
  onHoverProvider,
  verifiedOnly
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 font-medium">Finding available professionals...</p>
      </div>
    );
  }

  const displayServices = verifiedOnly 
    ? filteredServices.filter(service => service.provider?.verified)
    : filteredServices;

  if (displayServices.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-50 rounded-2xl p-12 inline-block mb-8">
          <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No professionals found</h3>
        <p className="text-gray-600 text-lg">Try adjusting your filters or location</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Professionals
        </h2>
        <p className="text-gray-600">
          {displayServices.length} {displayServices.length === 1 ? 'professional' : 'professionals'} found
        </p>
      </div>
      
      <div className="grid gap-4">
        {displayServices.map((service) => (
          <ModernServiceCard
            key={service.id}
            service={service}
            onBookNow={onBookNow}
            onHoverProvider={onHoverProvider}
          />
        ))}
      </div>
    </div>
  );
};

export default ModernServicesGrid;
