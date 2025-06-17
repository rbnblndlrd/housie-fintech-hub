import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  base_price: number;
  pricing_type: string;
  active: boolean;
}

interface ServicesSectionProps {
  providerId: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ providerId }) => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: 'Home Maintenance',
    base_price: 0,
    pricing_type: 'hourly',
  });

  useEffect(() => {
    fetchServices();
  }, [providerId]);

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

  const addService = async () => {
    if (!newService.title || !newService.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
          ...newService,
        })
        .select()
        .single();

      if (error) throw error;

      setServices([...services, data]);
      setNewService({
        title: '',
        description: '',
        category: 'Home Maintenance',
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
        <CardTitle className="text-gray-900">Services Offered</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Services */}
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">{service.title}</h4>
                  <Badge variant="secondary">{service.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{service.description}</p>
                <p className="text-sm font-medium text-gray-900">
                  ${service.base_price} / {service.pricing_type}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteService(service.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Service */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Add New Service</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title
                </label>
                <Input
                  value={newService.title}
                  onChange={(e) => setNewService({...newService, title: e.target.value})}
                  placeholder="e.g., Plumbing Repairs"
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({...newService, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Home Maintenance">Home Maintenance</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Landscaping">Landscaping</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                placeholder="Describe your service..."
                rows={3}
                className="border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price ($)
                </label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Type
                </label>
                <select
                  value={newService.pricing_type}
                  onChange={(e) => setNewService({...newService, pricing_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="per_service">Per Service</option>
                </select>
              </div>
            </div>

            <Button
              onClick={addService}
              disabled={saving}
              className="w-full fintech-button-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              {saving ? 'Adding Service...' : 'Add Service'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesSection;
