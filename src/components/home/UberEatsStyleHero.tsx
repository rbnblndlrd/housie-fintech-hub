
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
      {/* Detailed Neighborhood Illustration Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg viewBox="0 0 1200 800" className="w-full h-full object-cover" style={{ minHeight: '100vh' }}>
          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#87CEEB" />
              <stop offset="100%" stopColor="#F4A261" />
            </linearGradient>
            <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#90EE90" />
              <stop offset="100%" stopColor="#228B22" />
            </linearGradient>
          </defs>
          
          {/* Sky background */}
          <rect width="1200" height="400" fill="url(#skyGradient)" />
          
          {/* Ground */}
          <rect x="0" y="400" width="1200" height="400" fill="url(#grassGradient)" />
          
          {/* Sun */}
          <circle cx="100" cy="80" r="40" fill="#FFD700" />
          
          {/* Clouds */}
          <g fill="#FFFFFF" opacity="0.8">
            <ellipse cx="200" cy="60" rx="25" ry="15" />
            <ellipse cx="220" cy="55" rx="30" ry="18" />
            <ellipse cx="240" cy="60" rx="25" ry="15" />
            
            <ellipse cx="800" cy="90" rx="20" ry="12" />
            <ellipse cx="815" cy="85" rx="25" ry="15" />
            <ellipse cx="830" cy="90" rx="20" ry="12" />
          </g>
          
          {/* Houses */}
          <g>
            {/* House 1 - Left side */}
            <rect x="50" y="250" width="120" height="150" fill="#DEB887" stroke="#8B4513" strokeWidth="2" />
            <polygon points="50,250 110,200 170,250" fill="#8B4513" />
            <rect x="70" y="300" width="25" height="40" fill="#654321" />
            <rect x="120" y="280" width="30" height="30" fill="#87CEEB" stroke="#4682B4" strokeWidth="1" />
            
            {/* Handyman on ladder */}
            <rect x="45" y="200" width="8" height="80" fill="#8B4513" />
            <rect x="48" y="180" width="8" height="80" fill="#8B4513" />
            <circle cx="52" cy="170" r="8" fill="#FFDBAC" />
            <rect x="48" y="175" width="8" height="15" fill="#FF6B35" />
            <rect x="46" y="190" width="12" height="20" fill="#1E90FF" />
            
            {/* House 2 - Center */}
            <rect x="300" y="270" width="140" height="130" fill="#F0E68C" stroke="#DAA520" strokeWidth="2" />
            <polygon points="300,270 370,220 440,270" fill="#DC143C" />
            <rect x="320" y="320" width="30" height="50" fill="#654321" />
            <rect x="380" y="300" width="35" height="35" fill="#87CEEB" stroke="#4682B4" strokeWidth="1" />
            
            {/* Massage therapist visible through window */}
            <circle cx="397" cy="317" r="6" fill="#FFDBAC" />
            <rect x="394" y="323" width="6" height="10" fill="#FF69B4" />
            
            {/* House 3 - Right side */}
            <rect x="600" y="260" width="130" height="140" fill="#DDA0DD" stroke="#9370DB" strokeWidth="2" />
            <polygon points="600,260 665,210 730,260" fill="#228B22" />
            <rect x="620" y="310" width="28" height="45" fill="#654321" />
            <rect x="670" y="290" width="32" height="32" fill="#87CEEB" stroke="#4682B4" strokeWidth="1" />
          </g>
          
          {/* Lawn crew with mowers */}
          <g>
            {/* Lawn mower 1 */}
            <rect x="200" y="480" width="40" height="25" fill="#FF0000" />
            <circle cx="210" cy="510" r="8" fill="#000000" />
            <circle cx="230" cy="510" r="8" fill="#000000" />
            
            {/* Person pushing mower */}
            <circle cx="185" cy="460" r="10" fill="#FFDBAC" />
            <rect x="181" y="470" width="8" height="20" fill="#32CD32" />
            <rect x="179" y="490" width="12" height="25" fill="#FF6347" />
            
            {/* Lawn mower 2 */}
            <rect x="350" y="490" width="38" height="23" fill="#00FF00" />
            <circle cx="359" cy="518" r="7" fill="#000000" />
            <circle cx="378" cy="518" r="7" fill="#000000" />
            
            {/* Person 2 */}
            <circle cx="335" cy="470" r="9" fill="#FFDBAC" />
            <rect x="332" y="480" width="7" height="18" fill="#FFD700" />
            <rect x="330" y="498" width="11" height="22" fill="#4169E1" />
          </g>
          
          {/* Cleaning team */}
          <g>
            {/* Cleaning van */}            <rect x="450" y="470" width="80" height="40" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
            <text x="470" y="495" fontSize="12" fill="#FF6B35" fontWeight="bold">HOUSIE</text>
            <circle cx="465" cy="515" r="10" fill="#000000" />
            <circle cx="515" cy="515" r="10" fill="#000000" />
            
            {/* Cleaning people */}
            <circle cx="540" cy="470" r="8" fill="#FFDBAC" />
            <rect x="537" y="478" width="6" height="15" fill="#FF1493" />
            <rect x="535" y="493" width="10" height="20" fill="#000080" />
            
            <circle cx="560" cy="475" r="8" fill="#FFDBAC" />
            <rect x="557" y="483" width="6" height="15" fill="#00CED1" />
            <rect x="555" y="498" width="10" height="18" fill="#8B0000" />
          </g>
          
          {/* Pet sitter with dogs */}
          <g>
            {/* Person */}
            <circle cx="750" cy="460" r="10" fill="#FFDBAC" />
            <rect x="746" y="470" width="8" height="20" fill="#FF69B4" />
            <rect x="744" y="490" width="12" height="25" fill="#000080" />
            
            {/* Dogs */}
            <ellipse cx="720" cy="500" rx="15" ry="8" fill="#8B4513" />
            <circle cx="710" cy="495" r="5" fill="#8B4513" />
            <ellipse cx="780" cy="505" rx="12" ry="7" fill="#000000" />
            <circle cx="792" cy="502" r="4" fill="#000000" />
            
            {/* Leashes */}
            <line x1="745" y1="485" x2="720" y2="495" stroke="#000000" strokeWidth="2" />
            <line x1="750" y1="485" x2="780" y2="500" stroke="#000000" strokeWidth="2" />
          </g>
          
          {/* Event planners setting up */}
          <g>
            {/* Tent/canopy */}
            <polygon points="850,400 900,350 950,400" fill="#FF6347" stroke="#8B0000" strokeWidth="2" />
            <rect x="860" y="400" width="80" height="5" fill="#8B0000" />
            
            {/* People setting up */}
            <circle cx="870" cy="470" r="8" fill="#FFDBAC" />
            <rect x="867" y="478" width="6" height="15" fill="#32CD32" />
            <rect x="865" y="493" width="10" height="20" fill="#4B0082" />
            
            <circle cx="920" cy="465" r="8" fill="#FFDBAC" />
            <rect x="917" y="473" width="6" height="15" fill="#FFD700" />
            <rect x="915" y="488" width="10" height="20" fill="#8B4513" />
            
            {/* Tables and chairs */}
            <rect x="880" y="490" width="40" height="5" fill="#8B4513" />
            <rect x="885" y="495" width="5" height="15" fill="#8B4513" />
            <rect x="915" y="495" width="5" height="15" fill="#8B4513" />
          </g>
          
          {/* Snow removal crew (in corner showing winter prep) */}
          <g>
            {/* Snow plow truck */}
            <rect x="1000" y="470" width="70" height="35" fill="#FFA500" />
            <polygon points="1000,470 980,485 1000,500" fill="#C0C0C0" />
            <circle cx="1015" cy="510" r="8" fill="#000000" />
            <circle cx="1055" cy="510" r="8" fill="#000000" />
            
            {/* Snow piles */}
            <ellipse cx="950" cy="510" rx="20" ry="8" fill="#FFFFFF" />
            <ellipse cx="1100" cy="515" rx="25" ry="10" fill="#FFFFFF" />
            
            {/* Worker with shovel */}
            <circle cx="1080" cy="460" r="8" fill="#FFDBAC" />
            <rect x="1077" y="468" width="6" height="15" fill="#FF4500" />
            <rect x="1075" y="483" width="10" height="20" fill="#2F4F4F" />
            <line x1="1075" y1="475" x2="1065" y2="485" stroke="#8B4513" strokeWidth="3" />
          </g>
          
          {/* Trees scattered throughout */}
          <g fill="#228B22">
            <circle cx="150" cy="420" r="25" />
            <rect x="147" y="420" width="6" height="30" fill="#8B4513" />
            
            <circle cx="280" cy="430" r="20" />
            <rect x="278" y="430" width="4" height="25" fill="#8B4513" />
            
            <circle cx="550" cy="410" r="30" />
            <rect x="547" y="410" width="6" height="35" fill="#8B4513" />
            
            <circle cx="800" cy="425" r="22" />
            <rect x="798" y="425" width="4" height="28" fill="#8B4513" />
          </g>
          
          {/* Additional details */}
          <g>
            {/* Sidewalks */}
            <rect x="0" y="520" width="1200" height="10" fill="#C0C0C0" />
            
            {/* Flowers and bushes */}
            <circle cx="100" cy="440" r="8" fill="#FF69B4" />
            <circle cx="250" cy="450" r="6" fill="#FF1493" />
            <circle cx="400" cy="445" r="7" fill="#FF69B4" />
            <circle cx="650" cy="440" r="9" fill="#FF1493" />
            <circle cx="850" cy="455" r="6" fill="#FF69B4" />
          </g>
        </svg>
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
