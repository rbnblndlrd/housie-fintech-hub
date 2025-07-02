
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useDynamicGradients } from '@/hooks/useDynamicGradients';
import VideoBackground from '@/components/common/VideoBackground';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Apply dynamic gradients to cards
  useDynamicGradients();

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <VideoBackground />
        <div className="text-center space-y-4 relative z-30">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-600" />
          <p className="text-gray-700">Loading HOUSIE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white text-shadow-lg">
              Welcome to HOUSIE
            </h1>
            <p className="text-xl text-white/90 text-shadow mb-8">
              Your trusted home services platform
            </p>
            
            {!user ? (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm mr-4"
                size="lg"
              >
                Get Started
              </Button>
            ) : (
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  size="lg"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  onClick={() => navigate('/services')}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                  size="lg"
                >
                  Browse Services
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="fintech-text-header">Find Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="fintech-text-secondary">
                  Discover trusted professionals for all your home service needs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="fintech-text-header">Book Instantly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="fintech-text-secondary">
                  Schedule services at your convenience with real-time availability.
                </p>
              </CardContent>
            </Card>
            
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="fintech-text-header">Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="fintech-text-secondary">
                  Pay safely with our integrated payment system and service guarantees.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
