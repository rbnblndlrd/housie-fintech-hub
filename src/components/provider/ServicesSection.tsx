import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, AlertTriangle, Shield, Award } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  base_price: number;
  pricing_type: string;
  active: boolean;
  background_check_required: boolean;
  ccq_rbq_required: boolean;
  risk_category: string;
}

interface ProviderProfile {
  background_check_verified: boolean;
  ccq_verified: boolean;
  rbq_verified: boolean;
  verification_level: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}

interface ServiceSubcategory {
  id: string;
  category: string;
  subcategory: string;
  subcategory_id: string;
  icon: string;
  background_check_required: boolean;
  professional_license_required: boolean;
  professional_license_type: string | null;
  ccq_rbq_required: boolean;
  risk_category: string;
  description: string;
}

interface ServicesSectionProps {
  providerId: string;
}

const serviceCategories: ServiceCategory[] = [
  { id: 'personal_wellness', name: 'Personal Wellness', icon: '💆' },
  { id: 'cleaning', name: 'Cleaning Services', icon: '🧹' },
  { id: 'exterior_grounds', name: 'Exterior & Grounds', icon: '🌿' },
  { id: 'pet_care', name: 'Pet Care Services', icon: '🐕' },
  { id: 'appliance_tech', name: 'Appliance & Tech Repair', icon: '🔧' },
  { id: 'event_services', name: 'Event Services', icon: '🎪' },
  { id: 'moving_services', name: 'Moving Services', icon: '🚚' }
];

const ServicesSection: React.FC<ServicesSectionProps> = ({ providerId }) => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [subcategories, setSubcategories] = useState<ServiceSubcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    base_price: 0,
    pricing_type: 'hourly',
  });

  useEffect(() => {
    fetchServices();
    fetchProviderProfile();
  }, [providerId]);

  useEffect(() => {
    if (newService.category) {
      fetchSubcategories(newService.category);
    } else {
      setSubcategories([]);
    }
  }, [newService.category]);

  const fetchProviderProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('background_check_verified, ccq_verified, rbq_verified, verification_level')
        .eq('id', providerId)
        .single();

      if (error) throw error;
      setProviderProfile(data);
    } catch (error) {
      console.error('Error fetching provider profile:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('service_subcategories')
        .select('*')
        .eq('category', category)
        .order('subcategory', { ascending: true });

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const getSelectedSubcategory = () => {
    return subcategories.find(sub => sub.subcategory_id === newService.subcategory);
  };

  const canOfferSubcategory = (subcategory: ServiceSubcategory) => {
    if (!providerProfile) return false;
    
    const needsBackgroundCheck = subcategory.background_check_required;
    const needsCcqRbq = subcategory.ccq_rbq_required;
    
    if (needsBackgroundCheck && !providerProfile.background_check_verified) {
      return false;
    }
    
    if (needsCcqRbq && !providerProfile.ccq_verified && !providerProfile.rbq_verified) {
      return false;
    }
    
    return true;
  };

  const getVerificationBadges = (subcategory: ServiceSubcategory) => {
    const badges = [];
    
    if (subcategory.background_check_required) {
      badges.push(
        <Badge 
          key="bg-check" 
          variant="outline" 
          className={`${providerProfile?.background_check_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          <Shield className="h-3 w-3 mr-1" />
          Background Check
        </Badge>
      );
    }
    
    if (subcategory.ccq_rbq_required) {
      badges.push(
        <Badge 
          key="ccq-rbq" 
          variant="outline" 
          className={`${(providerProfile?.ccq_verified || providerProfile?.rbq_verified) ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}
        >
          <Award className="h-3 w-3 mr-1" />
          CCQ/RBQ
        </Badge>
      );
    }

    return badges;
  };

  const addService = async () => {
    if (!newService.title || !newService.category || !newService.subcategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const subcategoryData = getSelectedSubcategory();
    if (!subcategoryData) {
      toast({
        title: "Error",
        description: "Invalid subcategory selected",
        variant: "destructive",
      });
      return;
    }

    if (!canOfferSubcategory(subcategoryData)) {
      toast({
        title: "Verification Required",
        description: "You need the required verifications to offer this service",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('services')
        .insert({
          provider_id: providerId,
          title: newService.title,
          description: newService.description,
          category: newService.category,
          subcategory: newService.subcategory,
          base_price: newService.base_price,
          pricing_type: newService.pricing_type,
          background_check_required: subcategoryData.background_check_required,
          ccq_rbq_required: subcategoryData.ccq_rbq_required,
          risk_category: subcategoryData.risk_category,
        })
        .select()
        .single();

      if (error) throw error;

      setServices([...services, data]);
      setNewService({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        base_price: 0,
        pricing_type: 'hourly',
      });

      toast({
        title: "Success",
        description: "Service added successfully",
      });
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setServices(services.filter(s => s.id !== serviceId));
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <Card className="fintech-card">
        <CardContent className="p-6">
          <div className="text-center">Loading services...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span>🔧</span>
          My Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Verification Status */}
        {providerProfile && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Your Verification Status</h4>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={providerProfile.background_check_verified ? "default" : "secondary"}>
                <Shield className="h-3 w-3 mr-1" />
                Background Check: {providerProfile.background_check_verified ? 'Verified' : 'Not Verified'}
              </Badge>
              <Badge variant={(providerProfile.ccq_verified || providerProfile.rbq_verified) ? "default" : "secondary"}>
                <Award className="h-3 w-3 mr-1" />
                CCQ/RBQ: {(providerProfile.ccq_verified || providerProfile.rbq_verified) ? 'Verified' : 'Not Verified'}
              </Badge>
            </div>
          </div>
        )}

        {/* Add New Service Form */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Add New Service</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service Title *</label>
              <Input
                value={newService.title}
                onChange={(e) => setNewService({...newService, title: e.target.value})}
                placeholder="e.g., Professional House Cleaning"
                className="border-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Base Price ($CAD) *</label>
              <Input
                type="number"
                value={newService.base_price}
                onChange={(e) => setNewService({...newService, base_price: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <Select 
                value={newService.category} 
                onValueChange={(value) => setNewService({...newService, category: value, subcategory: ''})}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subcategory *</label>
              <Select 
                value={newService.subcategory} 
                onValueChange={(value) => setNewService({...newService, subcategory: value})}
                disabled={!newService.category}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => {
                    const canOffer = canOfferSubcategory(sub);
                    return (
                      <SelectItem 
                        key={sub.id} 
                        value={sub.subcategory_id}
                        disabled={!canOffer}
                        className={!canOffer ? 'opacity-50' : ''}
                      >
                        <div className="flex items-center gap-2">
                          <span>{sub.icon}</span>
                          <span>{sub.subcategory}</span>
                          {!canOffer && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {newService.subcategory && getSelectedSubcategory() && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-2">
                {getVerificationBadges(getSelectedSubcategory()!)}
              </div>
              <p className="text-sm text-gray-600">
                {getSelectedSubcategory()?.description}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
              placeholder="Describe your service in detail..."
              rows={3}
              className="border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pricing Type *</label>
            <Select 
              value={newService.pricing_type} 
              onValueChange={(value) => setNewService({...newService, pricing_type: value})}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="flat">Fixed Price</SelectItem>
                <SelectItem value="per_service">Per Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={addService} 
            disabled={saving || !newService.title || !newService.category || !newService.subcategory}
            className="w-full fintech-button-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            {saving ? 'Adding...' : 'Add Service'}
          </Button>
        </div>

        {/* Existing Services */}
        <div className="space-y-4">
          <h3 className="font-semibold">Current Services ({services.length})</h3>
          
          {services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No services added yet. Add your first service above!
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{service.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRiskBadgeColor(service.risk_category)}>
                        {service.risk_category} risk
                      </Badge>
                      {service.background_check_required && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-700">
                          <Shield className="h-3 w-3 mr-1" />
                          Background Check
                        </Badge>
                      )}
                      {service.ccq_rbq_required && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          <Award className="h-3 w-3 mr-1" />
                          CCQ/RBQ
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">${service.base_price}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteService(service.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {service.description && (
                  <p className="text-gray-600 mb-2">{service.description}</p>
                )}
                
                <div className="text-sm text-gray-500">
                  Category: {serviceCategories.find(cat => cat.id === service.category)?.name} • 
                  Subcategory: {service.subcategory} • 
                  Pricing: ${service.base_price} / {service.pricing_type}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesSection;
