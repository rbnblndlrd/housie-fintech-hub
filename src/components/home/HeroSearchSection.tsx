
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSearchSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [showBanner, setShowBanner] = useState(true);

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
    <>
      <div className="relative min-h-screen flex items-center justify-center pt-16">
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

        {/* Certn Banner - Fine-tuned thickness and smaller teeth */}
        {showBanner && (
          <div className="certn-banner-wrapper">
            <div 
              className="certn-banner-coupon"
              style={{ backgroundColor: '#d4f3b7' }}
            >
              <div className="relative z-10 flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/CERTN.png" 
                    alt="Certn" 
                    className="h-8 w-auto"
                  />
                  <span className="font-semibold text-lg text-gray-800">
                    Free background check with annual premium!
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  className="p-1 hover:bg-gray-800/10 text-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chainsaw Animation Styles */}
      <style>{`
        .certn-banner-wrapper {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          height: 60px;
          pointer-events: none;
        }

        .certn-banner-coupon {
          position: relative;
          width: 100%;
          height: 100%;
          pointer-events: auto;
          overflow: hidden;
        }

        /* Top chainsaw edge - positioned ON the banner */
        .certn-banner-coupon::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: repeating-linear-gradient(
            to right,
            #2d3748 0px,
            #2d3748 8px,
            transparent 8px,
            transparent 16px
          );
          animation: chainsawMoveHorizontal 1.5s linear infinite;
          z-index: 20;
        }

        /* Bottom chainsaw edge - positioned ON the banner */
        .certn-banner-coupon::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: repeating-linear-gradient(
            to right,
            #2d3748 0px,
            #2d3748 8px,
            transparent 8px,
            transparent 16px
          );
          animation: chainsawMoveHorizontal 1.5s linear infinite reverse;
          z-index: 20;
        }

        /* Left vertical chainsaw edge - positioned ON the banner */
        .certn-banner-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 6px;
          background: repeating-linear-gradient(
            to bottom,
            #2d3748 0px,
            #2d3748 8px,
            transparent 8px,
            transparent 16px
          );
          animation: chainsawMoveVertical 1.5s linear infinite reverse;
          z-index: 20;
        }

        /* Right vertical chainsaw edge - positioned ON the banner */
        .certn-banner-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 6px;
          background: repeating-linear-gradient(
            to bottom,
            #2d3748 0px,
            #2d3748 8px,
            transparent 8px,
            transparent 16px
          );
          animation: chainsawMoveVertical 1.5s linear infinite;
          z-index: 20;
        }

        @keyframes chainsawMoveHorizontal {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 16px 0px;
          }
        }

        @keyframes chainsawMoveVertical {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 0px 16px;
          }
        }

        /* Hover effects */
        .certn-banner-coupon:hover::before,
        .certn-banner-coupon:hover::after,
        .certn-banner-wrapper:hover::before,
        .certn-banner-wrapper:hover::after {
          animation-play-state: paused;
        }

        .certn-banner-coupon:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
      `}</style>
    </>
  );
};

export default HeroSearchSection;
