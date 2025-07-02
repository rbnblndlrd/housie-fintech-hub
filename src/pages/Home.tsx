
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 fintech-text-header">
            Welcome to HOUSIE
          </h1>
          <p className="text-xl fintech-text-secondary mb-8">
            Your trusted home services platform
          </p>
          
          {!user && (
            <Button 
              onClick={() => navigate('/auth')}
              className="fintech-button-primary mr-4"
              size="lg"
            >
              Get Started
            </Button>
          )}
          
          {user && (
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate('/customer-dashboard')}
                className="fintech-button-primary"
                size="lg"
              >
                Customer Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/provider-dashboard')}
                className="fintech-button-secondary"
                size="lg"
              >
                Provider Dashboard
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
  );
};

export default Home;
