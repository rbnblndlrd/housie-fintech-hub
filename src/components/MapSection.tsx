
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceCategories from "@/components/ServiceCategories";
import { UnifiedGoogleMap } from "@/components/UnifiedGoogleMap";
import { Provider } from "@/types/service";

interface MapSectionProps {
  onCategorySelect: (category: string) => void;
  providers: Provider[];
  hoveredProviderId?: string | null;
  showCategories?: boolean;
  title?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ 
  onCategorySelect, 
  providers,
  hoveredProviderId,
  showCategories = true,
  title = "Service Area Map"
}) => {
  // If showing categories, render with full card structure
  if (showCategories) {
    return (
      <div className="space-y-6">
        <ServiceCategories onCategorySelect={onCategorySelect} />

        {/* Interactive Google Map */}
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UnifiedGoogleMap
              center={{ lat: 45.5017, lng: -73.5673 }}
              zoom={12}
              className="h-64 rounded-xl"
              providers={providers}
              hoveredProviderId={hoveredProviderId}
              mode="services"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // For provider profile, render just the map without extra card wrapper
  return (
    <UnifiedGoogleMap
      center={{ lat: 45.5017, lng: -73.5673 }}
      zoom={12}
      className="h-full rounded-xl"
      providers={providers}
      hoveredProviderId={hoveredProviderId}
      mode="services"
    />
  );
};

export default MapSection;
