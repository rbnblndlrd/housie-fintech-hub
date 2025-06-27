
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  base_price: number;
  pricing_type: string;
}

interface SimpleBookingRequestProps {
  service: Service;
  providerId: string; 
  providerUserId: string;
}

const SimpleBookingRequest: React.FC<SimpleBookingRequestProps> = ({
  service,
  providerId,
  providerUserId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    scheduled_date: '',
    scheduled_time: '',
    service_address: '',
    instructions: '',
    duration_hours: 2
  });

  const handleSubmitRequest = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to request services.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.scheduled_date || !formData.scheduled_time || !formData.service_address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Calculate total amount
      const totalAmount = service.pricing_type === 'hourly' 
        ? service.base_price * formData.duration_hours
        : service.base_price;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          provider_id: providerId,
          service_id: service.id,
          scheduled_date: formData.scheduled_date,
          scheduled_time: formData.scheduled_time,
          service_address: formData.service_address,
          instructions: formData.instructions,
          duration_hours: formData.duration_hours,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Request sent successfully!",
        description: "The service provider will review your request and respond soon.",
      });

      setShowForm(false);
      setFormData({
        scheduled_date: '',
        scheduled_time: '',
        service_address: '',
        instructions: '',
        duration_hours: 2
      });

    } catch (error) {
      console.error('Error submitting booking request:', error);
      toast({
        title: "Error",
        description: "Failed to send your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (type === 'hourly') {
      return `$${price}/hour`;
    } else if (type === 'flat') {
      return `$${price} flat rate`;
    } else {
      return `$${price}`;
    }
  };

  const calculateEstimate = () => {
    if (service.pricing_type === 'hourly') {
      return service.base_price * formData.duration_hours;
    }
    return service.base_price;
  };

  if (!showForm) {
    return (
      <Card className="fintech-card border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-2">
                {service.title}
              </h3>
              <p className="text-green-700 mb-3 line-clamp-2">
                {service.description}
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formatPrice(service.base_price, service.pricing_type)}
                </Badge>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Request Service
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Request: {service.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Preferred Date *
            </label>
            <input
              type="date"
              value={formData.scheduled_date}
              onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Preferred Time *
            </label>
            <input
              type="time"
              value={formData.scheduled_time}
              onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            Service Address *
          </label>
          <input
            type="text"
            value={formData.service_address}
            onChange={(e) => setFormData({ ...formData, service_address: e.target.value })}
            placeholder="Enter the address where service is needed"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {service.pricing_type === 'hourly' && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Estimated Duration (hours)
            </label>
            <select
              value={formData.duration_hours}
              onChange={(e) => setFormData({ ...formData, duration_hours: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={4}>4 hours</option>
              <option value={6}>6 hours</option>
              <option value={8}>8 hours (full day)</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Special Instructions
          </label>
          <Textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Any specific requirements or details..."
            rows={3}
          />
        </div>

        {/* Price Estimate */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Estimated Total:</span>
            <span className="text-xl font-bold text-green-600">
              ${calculateEstimate()}
            </span>
          </div>
          {service.pricing_type === 'hourly' && (
            <p className="text-sm text-gray-600 mt-1">
              {service.base_price} × {formData.duration_hours} hours
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleSubmitRequest}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowForm(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-blue-50 rounded p-3">
          <strong>Next steps:</strong> The provider will review your request and either confirm with payment details or suggest alternative times. You'll be notified via email and in-app notifications.
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleBookingRequest;
