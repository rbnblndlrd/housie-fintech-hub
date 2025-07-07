import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/header/UserMenu';

const HeroSearchSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const serviceCategories = [
    'All Services',
    'Home Cleaning',
    'Plumbing',
    'Electrical',
    'HVAC',
    'Landscaping',
    'Pet Care',
    'Moving Services'
  ];

  const handleSearch = () => {
    console.log('Searching for:', { location, category: selectedCategory });
    navigate('/services');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Handle sign in logic here
      navigate('/auth');
    } catch (error) {
      console.error('Sign in error:', error);
    }
    setIsLoading(false);
  };

  // Render different UI based on authentication state
  if (!user) {
    // LOGGED OUT STATE - Polished Sign In Card
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Elegant Sign In Card - Birthday Card Style */}
        <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-orange-200/30 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">
              H
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Welcome to HOUSIE</CardTitle>
            <p className="text-gray-600">Sign in to access local services</p>
          </CardHeader>
          
          {/* Certn Banner - Integrated into card */}
          <div className="mx-6 mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
            <div className="flex items-center space-x-3">
              <img src="/CERTN.png" alt="Certn" className="h-5 w-auto flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">
                Free background check with annual premium!
              </span>
            </div>
          </div>

          <CardContent className="space-y-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-lg border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/auth" className="text-orange-600 hover:text-orange-700 font-semibold underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // LOGGED IN STATE - Search functionality with user menu
  return (
    <div className="relative min-h-screen flex flex-col px-4">
      {/* User Menu - Floating with enhanced visibility */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-2xl">
          <UserMenu />
        </div>
      </div>

      {/* Content positioned in bottom-left */}
      <div className="absolute bottom-8 left-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 drop-shadow-2xl" 
            style={{ 
              textShadow: '3px 3px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8), 6px 6px 12px rgba(0,0,0,0.5)' 
            }}>
          Browse
        </h1>

        {/* Search Bar - Enhanced visibility */}
        <div className="bg-white/25 backdrop-blur-md border-2 border-white/40 rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row gap-3">
          {/* Location Input */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            <Input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 border-none shadow-none text-lg h-14 focus:ring-0 bg-white/60 text-gray-900 placeholder:text-gray-600 font-medium rounded-xl"
            />
          </div>

          {/* Service Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white/60 border-none text-lg h-14 pr-8 pl-4 focus:ring-0 cursor-pointer min-w-[160px] font-medium text-gray-900 rounded-xl"
            >
              {serviceCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-black text-white hover:bg-gray-800 px-8 h-14 text-lg font-semibold rounded-xl border-2 border-black shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Search here
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSearchSection;