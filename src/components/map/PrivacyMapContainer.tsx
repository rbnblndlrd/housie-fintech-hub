
import React from 'react';
import { UnifiedGoogleMap } from "@/components/UnifiedGoogleMap";
import PrivacyInteractiveJobsMap from '@/components/PrivacyInteractiveJobsMap';

type UserRole = 'customer' | 'provider';

interface PrivacyMapContainerProps {
  showHeatZones: boolean;
  userRole: UserRole;
}

const PrivacyMapContainer: React.FC<PrivacyMapContainerProps> = ({ 
  showHeatZones, 
  userRole 
}) => {
  return (
    <div className="h-full w-full">
      <PrivacyInteractiveJobsMap 
        showHeatZones={showHeatZones}
      />
    </div>
  );
};

export default PrivacyMapContainer;
