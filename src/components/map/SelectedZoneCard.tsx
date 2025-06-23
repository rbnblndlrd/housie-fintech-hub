
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SelectedZoneCardProps {
  selectedZone: any;
  onClose: () => void;
}

const SelectedZoneCard: React.FC<SelectedZoneCardProps> = ({
  selectedZone,
  onClose
}) => {
  if (!selectedZone) return null;

  return (
    <div className="absolute top-20 left-4 z-10">
      <Card className="fintech-card max-w-xs">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg">{selectedZone.zone_name}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500"
            >
              ✕
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Demand:</span>
              <Badge variant={selectedZone.demand_level === 'high' ? 'destructive' : 'secondary'}>
                {selectedZone.demand_level}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="capitalize">{selectedZone.zone_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price Multiplier:</span>
              <span className="font-bold text-green-600">
                {selectedZone.pricing_multiplier}x
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectedZoneCard;
