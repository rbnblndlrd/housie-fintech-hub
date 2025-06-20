
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Clock, Zap } from 'lucide-react';

interface RateLimitControlsProps {
  controls: any;
  onUpdateControl: (field: string, value: number) => void;
  isUpdating: boolean;
}

const RateLimitControls: React.FC<RateLimitControlsProps> = ({
  controls,
  onUpdateControl,
  isUpdating
}) => {
  const [limits, setLimits] = useState({
    max_requests_per_hour: controls.max_requests_per_hour,
    max_requests_per_day: controls.max_requests_per_day,
    max_ai_requests_per_user_per_hour: controls.max_ai_requests_per_user_per_hour,
    max_ai_requests_per_user_per_day: controls.max_ai_requests_per_user_per_day
  });

  const updateLimit = (field: string) => {
    onUpdateControl(field, limits[field as keyof typeof limits]);
  };

  const hasChanges = (field: string) => {
    return limits[field as keyof typeof limits] !== controls[field];
  };

  return (
    <Card className="fintech-chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Rate Limiting Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Rate Limits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Global Platform Limits
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="globalHourly">Max Requests Per Hour (Global)</Label>
              <div className="flex gap-2">
                <Input
                  id="globalHourly"
                  type="number"
                  value={limits.max_requests_per_hour}
                  onChange={(e) => setLimits(prev => ({
                    ...prev,
                    max_requests_per_hour: Number(e.target.value)
                  }))}
                  min="1"
                  className="flex-1"
                />
                <Button
                  onClick={() => updateLimit('max_requests_per_hour')}
                  disabled={isUpdating || !hasChanges('max_requests_per_hour')}
                  size="sm"
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-gray-600">Current: {controls.max_requests_per_hour}/hour</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="globalDaily">Max Requests Per Day (Global)</Label>
              <div className="flex gap-2">
                <Input
                  id="globalDaily"
                  type="number"
                  value={limits.max_requests_per_day}
                  onChange={(e) => setLimits(prev => ({
                    ...prev,
                    max_requests_per_day: Number(e.target.value)
                  }))}
                  min="1"
                  className="flex-1"
                />
                <Button
                  onClick={() => updateLimit('max_requests_per_day')}
                  disabled={isUpdating || !hasChanges('max_requests_per_day')}
                  size="sm"
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-gray-600">Current: {controls.max_requests_per_day}/day</p>
            </div>
          </div>
        </div>

        {/* User-Specific AI Limits */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Per-User AI Limits
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userAiHourly">AI Requests Per User Per Hour</Label>
              <div className="flex gap-2">
                <Input
                  id="userAiHourly"
                  type="number"
                  value={limits.max_ai_requests_per_user_per_hour}
                  onChange={(e) => setLimits(prev => ({
                    ...prev,
                    max_ai_requests_per_user_per_hour: Number(e.target.value)
                  }))}
                  min="1"
                  className="flex-1"
                />
                <Button
                  onClick={() => updateLimit('max_ai_requests_per_user_per_hour')}
                  disabled={isUpdating || !hasChanges('max_ai_requests_per_user_per_hour')}
                  size="sm"
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-gray-600">Current: {controls.max_ai_requests_per_user_per_hour}/hour per user</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userAiDaily">AI Requests Per User Per Day</Label>
              <div className="flex gap-2">
                <Input
                  id="userAiDaily"
                  type="number"
                  value={limits.max_ai_requests_per_user_per_day}
                  onChange={(e) => setLimits(prev => ({
                    ...prev,
                    max_ai_requests_per_user_per_day: Number(e.target.value)
                  }))}
                  min="1"
                  className="flex-1"
                />
                <Button
                  onClick={() => updateLimit('max_ai_requests_per_user_per_day')}
                  disabled={isUpdating || !hasChanges('max_ai_requests_per_user_per_day')}
                  size="sm"
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-gray-600">Current: {controls.max_ai_requests_per_user_per_day}/day per user</p>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3">Quick Presets</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLimits({
                  max_requests_per_hour: 50,
                  max_requests_per_day: 500,
                  max_ai_requests_per_user_per_hour: 5,
                  max_ai_requests_per_user_per_day: 25
                });
              }}
            >
              Conservative
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLimits({
                  max_requests_per_hour: 100,
                  max_requests_per_day: 1000,
                  max_ai_requests_per_user_per_hour: 10,
                  max_ai_requests_per_user_per_day: 50
                });
              }}
            >
              Standard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLimits({
                  max_requests_per_hour: 200,
                  max_requests_per_day: 2000,
                  max_ai_requests_per_user_per_hour: 20,
                  max_ai_requests_per_user_per_day: 100
                });
              }}
            >
              High Traffic
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateLimitControls;
