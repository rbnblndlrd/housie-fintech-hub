
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceCategories from "@/components/ServiceCategories";
import { GoogleMap } from "@/components/GoogleMap";
import { Provider } from "@/types/service";

interface MapSectionProps {
  onCategorySelect: (category: string) => void;
  providers: Provider[];
  hoveredProviderId?: string | null;
}

const MapSection: React.FC<MapSectionProps> = ({ 
  onCategorySelect, 
  providers,
  hoveredProviderId 
}) => {
  return (
    <div className="lg:col-span-1">
      <ServiceCategories onCategorySelect={onCategorySelect} />

      {/* Interactive Google Map */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Service Area Map</CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleMap
            center={{ lat: 45.5017, lng: -73.5673 }}
            zoom={12}
            className="h-64 rounded-xl"
            providers={providers}
            hoveredProviderId={hoveredProviderId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSection;
