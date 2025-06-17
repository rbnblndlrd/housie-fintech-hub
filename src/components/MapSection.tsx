
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceCategories from "@/components/ServiceCategories";
import { GoogleMap } from "@/components/GoogleMap";
import { Provider } from "@/types/service";

interface MapSectionProps {
  onCategorySelect: (category: string) => void;
  providers: Provider[];
}

const MapSection: React.FC<MapSectionProps> = ({ onCategorySelect, providers }) => {
  return (
    <div className="lg:col-span-1">
      <ServiceCategories onCategorySelect={onCategorySelect} />

      {/* Interactive Google Map */}
      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Service Area Map</CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleMap
            center={{ lat: 45.5017, lng: -73.5673 }}
            zoom={12}
            className="h-64 rounded-xl"
            providers={providers}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSection;
