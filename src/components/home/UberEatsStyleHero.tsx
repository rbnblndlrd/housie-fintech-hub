
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UberEatsStyleHero = () => {
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');

  const serviceCategories = [
    'All Services',
    'Home Cleaning',
    'Plumbing',
    'Electrical',
    'HVAC',
    'Landscaping',
    'Handyman',
    'Moving',
    'Pest Control'
  ];

  const handleSearch = () => {
    console.log('Searching for:', { location, category: selectedCategory });
    // Navigate to services page with filters
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#F4A261' }}>
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
          {/* Fallback background color if video fails to load */}
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Floating Search Bar */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
          Find local experts near you
        </h1>
        
        <div className="bg-white rounded-lg shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto border-2 border-black">
          {/* Location Input */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Enter your address"
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
            className="bg-black text-white hover:bg-gray-800 px-8 h-12 text-lg rounded-lg border-2 border-black"
          >
            Search here
          </Button>
        </div>

        <p className="mt-4 text-white/90 drop-shadow-lg">
          Or{' '}
          <button className="underline font-medium text-white hover:text-white/80">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default UberEatsStyleHero;
