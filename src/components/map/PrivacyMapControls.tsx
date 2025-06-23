
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeOff } from 'lucide-react';

interface PrivacyMapControlsProps {
  showHeatZones: boolean;
  onToggleHeatZones: (show: boolean) => void;
}

const PrivacyMapControls: React.FC<PrivacyMapControlsProps> = ({
  showHeatZones,
  onToggleHeatZones
}) => {
  return (
    <>
      {/* Privacy Notice */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
          <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-1">
            <Shield className="h-4 w-4" />
            Privacy Protected
          </div>
          <p className="text-xs text-blue-600">
            Locations are anonymized for privacy. Providers shown as fuzzy dots, jobs as service areas.
          </p>
        </div>
      </div>

      {/* Heat Zones Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant={showHeatZones ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleHeatZones(!showHeatZones)}
          className="bg-white/90 backdrop-blur-sm"
        >
          {showHeatZones ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          Heat Zones
        </Button>
      </div>
    </>
  );
};

export default PrivacyMapControls;
