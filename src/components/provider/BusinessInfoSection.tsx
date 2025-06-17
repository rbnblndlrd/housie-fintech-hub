
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProviderProfile {
  id: string;
  business_name: string;
  description: string;
  years_experience: number;
  hourly_rate: number;
  service_radius_km: number;
  cra_compliant: boolean;
  verified: boolean;
  insurance_verified: boolean;
}

interface BusinessInfoSectionProps {
  providerProfile: ProviderProfile;
  setProviderProfile: (profile: ProviderProfile) => void;
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({
  providerProfile,
  setProviderProfile,
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    business_name: providerProfile.business_name || '',
    description: providerProfile.description || '',
    years_experience: providerProfile.years_experience || 0,
    hourly_rate: providerProfile.hourly_rate || 0,
    service_radius_km: providerProfile.service_radius_km || 10,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('provider_profiles')
        .update(formData)
        .eq('id', providerProfile.id)
        .select()
        .single();

      if (error) throw error;

      setProviderProfile({ ...providerProfile, ...data });
      toast({
        title: "Success",
        description: "Business information updated successfully",
      });
    } catch (error) {
      console.error('Error updating business info:', error);
      toast({
        title: "Error",
        description: "Failed to update business information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="text-gray-900">Business Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <Input
            value={formData.business_name}
            onChange={(e) => handleInputChange('business_name', e.target.value)}
            placeholder="Enter your business name"
            className="border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Description
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your business and services..."
            rows={4}
            className="border-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <Input
              type="number"
              value={formData.years_experience}
              onChange={(e) => handleInputChange('years_experience', parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              className="border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            <Input
              type="number"
              value={formData.hourly_rate}
              onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Radius (km)
          </label>
          <Input
            type="number"
            value={formData.service_radius_km}
            onChange={(e) => handleInputChange('service_radius_km', parseInt(e.target.value) || 0)}
            placeholder="10"
            min="0"
            className="border-gray-300"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full fintech-button-primary"
        >
          {saving ? 'Saving...' : 'Save Business Information'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BusinessInfoSection;
