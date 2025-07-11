import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  CheckCircle, 
  Briefcase
} from 'lucide-react';
import { ProviderOnboardingStep1 } from '@/components/onboarding/ProviderOnboardingStep1';
import { ProviderOnboardingStep2 } from '@/components/onboarding/ProviderOnboardingStep2';
import { ProviderOnboardingStep3 } from '@/components/onboarding/ProviderOnboardingStep3';

const ProviderSetup = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    years_experience: '',
    hourly_rate: '',
    service_radius_km: '25'
  });

  // Redirect if already a provider
  useEffect(() => {
    if (currentRole === 'provider') {
      toast({
        title: "You're already a provider!",
        description: "Let's go to your dashboard.",
      });
      navigate('/dashboard');
    }
  }, [currentRole, navigate, toast]);

  const progressSteps = [
    { number: 1, title: "Basic Info", completed: step > 1 },
    { number: 2, title: "Services", completed: step > 2 },
    { number: 3, title: "Verification", completed: step > 3 }
  ];

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => step === 1 ? navigate('/dashboard') : setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ProviderOnboardingStep1
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <ProviderOnboardingStep2
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ProviderOnboardingStep3
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

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
              
              <div className="bg-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
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
                        ? 'bg-primary text-white'
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

            {/* Render Current Step */}
            {renderStep()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderSetup;