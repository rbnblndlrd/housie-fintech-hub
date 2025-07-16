import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle, Dog, Leaf, HardHat, Wrench } from 'lucide-react';

interface PrepRequirement {
  id: string;
  name: string;
  icon: React.ReactNode;
  available: boolean;
  critical?: boolean;
}

interface PrepRequirementsPreviewProps {
  requirements?: PrepRequirement[];
  specialTags?: string[];
}

const PrepRequirementsPreview: React.FC<PrepRequirementsPreviewProps> = ({
  requirements = [
    { id: 'pressure-washer', name: 'Pressure Washer', icon: <Wrench className="h-4 w-4" />, available: true },
    { id: 'hose', name: '25ft Hose', icon: <Package className="h-4 w-4" />, available: true },
    { id: 'safety-gear', name: 'Safety Gear', icon: <HardHat className="h-4 w-4" />, available: true, critical: true }
  ],
  specialTags = ['Heavy Lift', 'Dog On Site', 'Client Requests Organic Products']
}) => {
  const criticalMissing = requirements.filter(req => req.critical && !req.available);
  const regularMissing = requirements.filter(req => !req.critical && !req.available);

  return (
    <Card className="fintech-card border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5 text-blue-600" />
          Prep Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Equipment Checklist */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Equipment Needed:</div>
          {requirements.map((req) => (
            <div key={req.id} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                req.available 
                  ? 'bg-green-50 border-green-300' 
                  : req.critical 
                    ? 'bg-red-50 border-red-300'
                    : 'bg-yellow-50 border-yellow-300'
              }`}>
                {req.available && <div className="w-2 h-2 bg-green-600 rounded-full" />}
                {!req.available && req.critical && <div className="w-2 h-2 bg-red-600 rounded-full" />}
                {!req.available && !req.critical && <div className="w-2 h-2 bg-yellow-600 rounded-full" />}
              </div>
              <div className="flex items-center gap-2">
                {req.icon}
                <span className={`text-sm ${req.available ? 'text-gray-700' : 'text-gray-500'}`}>
                  {req.name}
                </span>
                {req.critical && !req.available && (
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Missing Items Alert */}
        {(criticalMissing.length > 0 || regularMissing.length > 0) && (
          <div className="pt-3 border-t">
            {criticalMissing.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Critical Items Missing</p>
                  <p className="text-xs text-red-700">
                    {criticalMissing.map(item => item.name).join(', ')} required before starting
                  </p>
                </div>
              </div>
            )}
            
            {regularMissing.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Package className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Items to Acquire</p>
                  <p className="text-xs text-yellow-700">
                    {regularMissing.map(item => item.name).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Special Tags */}
        {specialTags.length > 0 && (
          <div className="pt-3 border-t">
            <div className="text-sm font-medium text-gray-700 mb-2">Special Considerations:</div>
            <div className="flex flex-wrap gap-2">
              {specialTags.map((tag, index) => {
                const getTagIcon = (tag: string) => {
                  if (tag.toLowerCase().includes('dog')) return <Dog className="h-3 w-3" />;
                  if (tag.toLowerCase().includes('organic')) return <Leaf className="h-3 w-3" />;
                  if (tag.toLowerCase().includes('heavy')) return <HardHat className="h-3 w-3" />;
                  return null;
                };

                const getTagColor = (tag: string) => {
                  if (tag.toLowerCase().includes('dog')) return 'bg-orange-100 text-orange-700 border-orange-200';
                  if (tag.toLowerCase().includes('organic')) return 'bg-green-100 text-green-700 border-green-200';
                  if (tag.toLowerCase().includes('heavy')) return 'bg-red-100 text-red-700 border-red-200';
                  return 'bg-gray-100 text-gray-700 border-gray-200';
                };

                return (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`flex items-center gap-1 text-xs ${getTagColor(tag)}`}
                  >
                    {getTagIcon(tag)}
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Action */}
        <div className="pt-3 border-t">
          <Button variant="outline" size="sm" className="w-full">
            View Full Equipment List
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrepRequirementsPreview;