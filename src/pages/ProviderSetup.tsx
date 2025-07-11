import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedProfile } from '@/hooks/useUnifiedProfile';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  DollarSign,
  MapPin,
  Star,
  Shield,
  User,
  Briefcase
} from 'lucide-react';

const ProviderSetup = () => {
  const { user } = useAuth();
  const { updateProfile } = useUnifiedProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    years_experience: '',
    hourly_rate: '',
    service_radius_km: '25'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        business_name: formData.business_name,
        description: formData.description,
        years_experience: parseInt(formData.years_experience) || 0,
        hourly_rate: parseFloat(formData.hourly_rate) || 0,
        service_radius_km: parseInt(formData.service_radius_km) || 25,
        verification_level: 'basic'
      });

      toast({
        title: "Profile Setup Complete!",
        description: "You're now ready to start offering services.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = [
    { number: 1, title: "Basic Info", completed: step > 1 },
    { number: 2, title: "Services", completed: step > 2 },
    { number: 3, title: "Verification", completed: step > 3 }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        
        <div className="pt-24 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="absolute left-4 top-28 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div className="bg-blue-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                Complete Your Provider Profile
              </h1>
              <p className="text-white/90 text-shadow">
                Set up your profile to start offering services and earning money
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-center items-center space-x-4">
                {progressSteps.map((stepItem, index) => (
                  <div key={stepItem.number} className="flex items-center">
                    <div className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium ${
                      stepItem.completed 
                        ? 'bg-green-600 text-white' 
                        : step === stepItem.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/20 text-white/70'
                    }`}>
                      {stepItem.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        stepItem.number
                      )}
                    </div>
                    <span className={`ml-2 text-sm ${
                      stepItem.completed || step === stepItem.number ? 'text-white font-medium' : 'text-white/70'
                    }`}>
                      {stepItem.title}
                    </span>
                    {index < progressSteps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${
                        stepItem.completed ? 'bg-green-600' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Provider Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Business Name *</Label>
                      <Input
                        id="business_name"
                        value={formData.business_name}
                        onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                        placeholder="Your Business Name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="years_experience">Years of Experience</Label>
                      <Input
                        id="years_experience"
                        type="number"
                        value={formData.years_experience}
                        onChange={(e) => setFormData({...formData, years_experience: e.target.value})}
                        placeholder="5"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Service Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the services you offer..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="hourly_rate">Hourly Rate (CAD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="hourly_rate"
                          type="number"
                          value={formData.hourly_rate}
                          onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                          placeholder="50"
                          className="pl-10"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service_radius">Service Radius (km)</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="service_radius"
                          type="number"
                          value={formData.service_radius_km}
                          onChange={(e) => setFormData({...formData, service_radius_km: e.target.value})}
                          placeholder="25"
                          className="pl-10"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Benefits Preview */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      What happens next:
                    </h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Your profile will be reviewed (usually within 24 hours)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>You'll appear in search results for customers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Start receiving booking requests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Complete verification steps to boost your ranking</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      className="flex-1"
                    >
                      Save & Continue Later
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !formData.business_name || !formData.description}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? 'Saving...' : 'Complete Setup'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderSetup;