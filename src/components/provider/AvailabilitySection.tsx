
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';

interface AvailabilitySectionProps {
  providerId: string;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({ providerId }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '17:00' },
  });

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  const updateDayAvailability = (day: string, field: string, value: boolean | string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // In a real application, you would save this to a database
      // For now, we'll just show a success message
      
      toast({
        title: "Success",
        description: "Availability schedule updated successfully",
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability schedule",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Availability Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {Object.entries(dayNames).map(([day, dayName]) => {
            const dayData = availability[day as keyof typeof availability];
            return (
              <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3 min-w-[120px]">
                  <Switch
                    checked={dayData.enabled}
                    onCheckedChange={(checked) => updateDayAvailability(day, 'enabled', checked)}
                  />
                  <span className="font-medium text-gray-900">{dayName}</span>
                </div>
                
                {dayData.enabled && (
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">From:</label>
                      <Input
                        type="time"
                        value={dayData.start}
                        onChange={(e) => updateDayAvailability(day, 'start', e.target.value)}
                        className="w-32 border-gray-300"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">To:</label>
                      <Input
                        type="time"
                        value={dayData.end}
                        onChange={(e) => updateDayAvailability(day, 'end', e.target.value)}
                        className="w-32 border-gray-300"
                      />
                    </div>
                  </div>
                )}
                
                {!dayData.enabled && (
                  <div className="flex-1">
                    <span className="text-sm text-gray-500">Unavailable</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t pt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Availability Notes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Set your regular working hours for each day</li>
              <li>• Customers will see your availability when booking</li>
              <li>• You can always adjust these hours later</li>
              <li>• Emergency services can be arranged outside these hours</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full fintech-button-primary"
        >
          {saving ? 'Saving...' : 'Save Availability Schedule'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AvailabilitySection;
