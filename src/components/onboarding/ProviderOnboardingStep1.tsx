import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  Clock, 
  DollarSign,
  MapPin,
  Star,
  User
} from 'lucide-react';

interface FormData {
  business_name: string;
  description: string;
  years_experience: string;
  hourly_rate: string;
  service_radius_km: string;
}

interface Props {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProviderOnboardingStep1: React.FC<Props> = ({
  formData,
  setFormData,
  onNext,
  onBack
}) => {
  const validateStep1 = () => {
    if (!formData.business_name.trim()) return false;
    if (!formData.description.trim()) return false;
    
    const rate = parseFloat(formData.hourly_rate);
    if (isNaN(rate) || rate < 15 || rate > 500) return false;
    
    const radius = parseInt(formData.service_radius_km);
    if (isNaN(radius) || radius < 1 || radius > 100) return false;
    
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      onNext();
    }
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <User className="h-5 w-5" />
          Provider Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="business_name" className="text-card-foreground">Business Name *</Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) => setFormData({...formData, business_name: e.target.value})}
              placeholder="Your Business Name"
              className="bg-muted/20 border-muted-foreground/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="years_experience" className="text-card-foreground">Years of Experience</Label>
            <Input
              id="years_experience"
              type="number"
              value={formData.years_experience}
              onChange={(e) => setFormData({...formData, years_experience: e.target.value})}
              placeholder="5"
              className="bg-muted/20 border-muted-foreground/20"
              min="0"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-card-foreground">Service Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe the services you offer..."
            className="bg-muted/20 border-muted-foreground/20"
            rows={4}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hourly_rate" className="text-card-foreground">Hourly Rate (CAD) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="hourly_rate"
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                placeholder="50"
                className="pl-10 bg-muted/20 border-muted-foreground/20"
                min="15"
                max="500"
                step="0.01"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">Minimum $15, maximum $500</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service_radius" className="text-card-foreground">Service Radius (km) *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="service_radius"
                type="number"
                value={formData.service_radius_km}
                onChange={(e) => setFormData({...formData, service_radius_km: e.target.value})}
                placeholder="25"
                className="pl-10 bg-muted/20 border-muted-foreground/20"
                min="1"
                max="100"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">1-100 km service area</p>
          </div>
        </div>

        {/* What happens next - Dark theme */}
        <div className="bg-green-900/50 text-card-foreground border border-green-300/30 rounded-xl px-4 py-3">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" />
            What happens next:
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Your profile will be reviewed (usually within 24 hours)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>You'll appear in search results for customers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Start receiving booking requests</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>Complete verification steps to boost your ranking</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-muted-foreground/20"
          >
            Back to Dashboard
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!validateStep1()}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Continue to Services
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};