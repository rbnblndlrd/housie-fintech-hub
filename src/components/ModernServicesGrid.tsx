
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import ModernServiceCard from "./ModernServiceCard";
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
  services,
  filteredServices,
  isLoading,
  onBookNow,
  onHoverProvider,
  verifiedOnly
}) => {
  // Apply verified filter if needed and filter out services with null providers
  const displayServices = (verifiedOnly 
    ? filteredServices.filter(service => service.provider?.verified)
    : filteredServices
  ).filter(service => service.provider !== null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>
        <div className="grid gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="fintech-card p-6">
              <div className="flex items-start gap-6">
                <Skeleton className="w-20 h-20 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
        <div className="text-sm text-gray-500">
          {displayServices.length} service{displayServices.length !== 1 ? 's' : ''} found
          {verifiedOnly && ' (verified only)'}
        </div>
      </div>

      {displayServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayServices.map((service) => (
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

export default ModernServicesGrid;
