
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

        {/* Fixed Banner - Full width with chainsaw edges */}
        {showBanner && (
          <div 
            className="fixed bottom-0 left-0 right-0 z-40 text-gray-800 certn-banner-coupon"
            style={{ backgroundColor: '#d4f3b7' }}
          >
            <div className="w-full flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-3">
                {/* Actual Certn Logo from public directory */}
                <img 
                  src="/CERTN.png" 
                  alt="Certn" 
                  className="h-8 w-auto"
                />
                <span className="font-semibold text-sm md:text-base text-gray-800">
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
        )}
      </div>

      {/* Chainsaw Animation Styles */}
      <style>{`
        @keyframes chainsawMove {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 20px 0px;
          }
        }

        @keyframes chainsawMoveVertical {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 0px 20px;
          }
        }

        .certn-banner-coupon {
          transform-origin: center center;
          will-change: transform;
          position: relative;
          margin: 0;
          border: none;
          box-shadow: none;
        }

        /* Top horizontal chainsaw edge */
        .certn-banner-coupon::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 0;
          right: 0;
          height: 8px;
          background: repeating-linear-gradient(
            to right,
            #2d3748 0px,
            #2d3748 8px,
            transparent 8px,
            transparent 16px
          );
          animation: chainsawMove 1s linear infinite;
          z-index: 1;
        }

        /* Bottom horizontal chainsaw edge */
        .certn-banner-coupon::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 8px;
          background: repeating-linear-gradient(
            to right,
            #2d3748 0px,
            #2d3748 8px,
            transparent 8px,
            transparent 16px
          );
          animation: chainsawMove 1s linear infinite;
          z-index: 1;
        }

        /* Create pseudo-elements for vertical edges using a wrapper approach */
        .certn-banner-coupon {
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          background-clip: padding-box;
          position: relative;
        }

        /* Left vertical chainsaw edge */
        .certn-banner-coupon:before {
          background-image: 
            repeating-linear-gradient(
              to right,
              #2d3748 0px,
              #2d3748 8px,
              transparent 8px,
              transparent 16px
            ),
            repeating-linear-gradient(
              to bottom,
              #2d3748 0px,
              #2d3748 8px,
              transparent 8px,
              transparent 16px
            );
          background-position: 0 0, -4px 0;
          background-size: 100% 8px, 8px 100%;
          background-repeat: repeat-x, repeat-y;
        }

        .certn-banner-coupon:after {
          background-image: 
            repeating-linear-gradient(
              to right,
              #2d3748 0px,
              #2d3748 8px,
              transparent 8px,
              transparent 16px
            ),
            repeating-linear-gradient(
              to bottom,
              #2d3748 0px,
              #2d3748 8px,
              transparent 8px,
              transparent 16px
            );
          background-position: 0 0, calc(100% + 4px) 0;
          background-size: 100% 8px, 8px 100%;
          background-repeat: repeat-x, repeat-y;
        }

        /* Add left and right vertical edges with separate pseudo-elements */
        .certn-banner-coupon {
          position: relative;
        }

        .certn-banner-coupon:before {
          left: -4px;
          width: calc(100% + 8px);
        }

        .certn-banner-coupon:after {
          left: -4px;
          width: calc(100% + 8px);
        }

        /* Use box-shadow to create vertical chainsaw edges */
        .certn-banner-coupon {
          box-shadow: 
            /* Left vertical edge */
            -4px 0 0 0 transparent,
            -4px 8px 0 0 #2d3748,
            -4px 16px 0 0 transparent,
            -4px 24px 0 0 #2d3748,
            -4px 32px 0 0 transparent,
            -4px 40px 0 0 #2d3748,
            -4px 48px 0 0 transparent,
            -4px 56px 0 0 #2d3748,
            -4px 64px 0 0 transparent,
            -4px 72px 0 0 #2d3748,
            -4px 80px 0 0 transparent,
            /* Right vertical edge */
            calc(100vw) 0 0 0 transparent,
            calc(100vw) 8px 0 0 #2d3748,
            calc(100vw) 16px 0 0 transparent,
            calc(100vw) 24px 0 0 #2d3748,
            calc(100vw) 32px 0 0 transparent,
            calc(100vw) 40px 0 0 #2d3748,
            calc(100vw) 48px 0 0 transparent,
            calc(100vw) 56px 0 0 #2d3748,
            calc(100vw) 64px 0 0 transparent,
            calc(100vw) 72px 0 0 #2d3748,
            calc(100vw) 80px 0 0 transparent;
        }

        /* Hover interaction - pause chainsaw */
        .certn-banner-coupon:hover::before,
        .certn-banner-coupon:hover::after {
          animation-play-state: paused;
        }

        .certn-banner-coupon:hover {
          transform: translateY(-2px) scale(1.02);
          transition: transform 0.2s ease;
        }

        /* Ensure smooth performance */
        .certn-banner-coupon * {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </>
  );
};

export default HeroSearchSection;
