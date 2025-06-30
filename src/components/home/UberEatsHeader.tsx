
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MapPin, ChevronDown, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const UberEatsHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [showBanner, setShowBanner] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <div className="relative">
      {/* Header Navigation - Black Background */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Menu + Logo */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white hover:bg-gray-800"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/a4e647f0-865a-42ef-a0cc-19226d5f0a35.png" 
                  alt="HOUSIE" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = '/lovable-uploads/243ecf21-712f-439a-9efc-a299b76af346.png';
                  }}
                />
              </Link>
            </div>

            {/* Right Side - Navigation Buttons */}
            <div className="flex items-center space-x-3">
              <Link to="/interactive-map">
                <Button variant="ghost" className="hidden md:flex items-center space-x-1 text-white hover:bg-gray-800">
                  <span>Around me</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-white hover:bg-gray-800">Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/auth">
                    <Button variant="ghost" className="text-white hover:bg-gray-800">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-white text-black hover:bg-gray-200">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-16 left-4 w-64 bg-black shadow-lg rounded-lg border border-gray-800 z-50 md:hidden">
            <div className="py-2">
              <Link
                to="/services"
                className="block px-4 py-3 text-white hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/interactive-map"
                className="block px-4 py-3 text-white hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Around me
              </Link>
              <Link
                to="/help"
                className="block px-4 py-3 text-white hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Video Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.8)' }}
          >
            <source src="/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4" type="video/mp4" />
            {/* Fallback background */}
            <div className="w-full h-full bg-gradient-to-br from-orange-300 via-amber-400 to-red-400"></div>
          </video>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            Find local experts near you
          </h1>
          
          {/* Search Bar - Exact UberEats Style */}
          <div className="bg-white rounded-lg shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            {/* Location Input */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Enter delivery address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 border-none shadow-none text-lg h-12 focus:ring-0"
              />
            </div>

            {/* Service Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent border-none text-lg h-12 pr-8 pl-4 focus:ring-0 cursor-pointer min-w-[150px]"
              >
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-black text-white hover:bg-gray-800 px-8 h-12 text-lg rounded-lg"
            >
              Search here
            </Button>
          </div>

          <p className="mt-4 text-white/90 drop-shadow-lg">
            Or{' '}
            <Link to="/auth" className="underline font-medium text-white hover:text-white/80">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Banner - UberEats Style */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-amber-400 to-orange-400 text-black px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Certn Logo Placeholder */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-amber-600">C</span>
              </div>
              <span className="font-semibold text-sm md:text-base">
                Free background check with annual premium!
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBanner(false)}
              className="p-1 hover:bg-amber-500/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UberEatsHeader;
