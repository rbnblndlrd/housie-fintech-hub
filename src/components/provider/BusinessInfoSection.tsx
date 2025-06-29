
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    business_name: providerProfile.business_name || '',
    description: providerProfile.description || '',
    years_experience: providerProfile.years_experience || 0,
    hourly_rate: providerProfile.hourly_rate || 0,
    service_radius_km: providerProfile.service_radius_km || 25,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear any previous errors when user starts typing
    if (saveError) {
      setSaveError(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      
      console.log('🔄 Updating business info for provider:', providerProfile.id);
      console.log('📤 Update data:', formData);
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .update(formData)
        .eq('id', providerProfile.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Business info update failed:', error);
        
        let errorMessage = "Failed to update business information";
        if (error.code === '42501') {
          errorMessage = "Permission denied. Please try logging out and back in";
        } else if (error.code === '23502') {
          errorMessage = "Please fill in all required fields";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setSaveError(errorMessage);
        throw new Error(errorMessage);
      }

      if (!data) {
        const msg = "Update successful but no data returned";
        console.warn('⚠️', msg);
        // Still update local state with form data
        setProviderProfile({ ...providerProfile, ...formData });
      } else {
        console.log('✅ Business info updated successfully');
        setProviderProfile({ ...providerProfile, ...data });
      }

      toast({
        title: "Success",
        description: "Business information updated successfully",
      });
    } catch (error: any) {
      console.error('❌ Error in handleSave:', error);
      const errorMsg = error.message || "An unexpected error occurred";
      setSaveError(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const retrySave = () => {
    setSaveError(null);
    handleSave();
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="text-gray-900">Business Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-700 text-sm mb-2">{saveError}</p>
                <Button 
                  onClick={retrySave}
                  disabled={saving}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  {saving ? 'Retrying...' : 'Try Again'}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
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
            placeholder="25"
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
