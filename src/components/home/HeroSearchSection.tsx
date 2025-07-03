
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSearchSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');

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
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Certn Info - Top Right Corner - Tilted */}
      <div className="absolute top-[120px] right-[50px] z-20 flex items-center space-x-2 fintech-card backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg" style={{ transform: 'rotate(-15deg)' }}>
        <img 
          src="/CERTN.png" 
          alt="Certn" 
          className="h-6 w-auto"
        />
        <span className="text-sm font-medium text-gray-800">
          Free background check with annual premium!
        </span>
      </div>

      {/* Animated Dashboard Indicator */}
      <Link 
        to="/dashboard" 
        className="absolute top-[280px] right-[400px] z-5 text-white font-bold text-lg cursor-pointer hover:scale-105 transition-transform duration-300 dashboard-arrow-pulse"
        style={{ 
          textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)'
        }}
      >
        Dashboard
      </Link>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 text-shadow-lg">
          Find local experts near you
        </h1>
        
        {/* Search Bar - Clean UberEats Style */}
        <div className="fintech-card rounded-lg shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-6">
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
              className="pl-10 border-none shadow-none text-lg h-12 focus:ring-0 bg-transparent"
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
            className="bg-black text-white hover:bg-gray-800 px-8 h-12 text-lg rounded-lg border-2 border-black"
          >
            Search here
          </Button>
        </div>

        <p className="text-white/90 text-shadow drop-shadow-lg">
          Or{' '}
          <Link to="/auth" className="underline font-medium text-white hover:text-white/80">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HeroSearchSection;
