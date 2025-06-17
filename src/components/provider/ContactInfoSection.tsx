
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, Image } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  profile_image: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
}

interface ContactInfoSectionProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  userProfile,
  setUserProfile,
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    province: userProfile?.province || '',
    postal_code: userProfile?.postal_code || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!userProfile) return;

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', userProfile.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile({ ...userProfile, ...data });
      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
    } catch (error) {
      console.error('Error updating contact info:', error);
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userProfile) return;

    try {
      // For now, we'll just show a placeholder since file upload requires storage setup
      toast({
        title: "Info",
        description: "Image upload functionality will be implemented with storage setup",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="text-gray-900">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Photo */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userProfile?.profile_image} />
            <AvatarFallback className="bg-gray-100 text-gray-700">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm text-gray-700 border border-gray-300 flex items-center space-x-2"
              >
                <Image className="h-4 w-4" />
                <span>Upload Photo</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <Input
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Enter your full name"
            className="border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className="border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <Input
            value={userProfile?.email || ''}
            disabled
            className="border-gray-300 bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <Input
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="123 Main Street"
            className="border-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Toronto"
              className="border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Province
            </label>
            <Input
              value={formData.province}
              onChange={(e) => handleInputChange('province', e.target.value)}
              placeholder="ON"
              className="border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code
          </label>
          <Input
            value={formData.postal_code}
            onChange={(e) => handleInputChange('postal_code', e.target.value)}
            placeholder="M5V 3A8"
            className="border-gray-300"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full fintech-button-primary"
        >
          {saving ? 'Saving...' : 'Save Contact Information'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContactInfoSection;
