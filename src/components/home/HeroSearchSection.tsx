
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, Move, RotateCw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSearchSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  
  // Positioning mode state
  const [positioningMode, setPositioningMode] = useState(true);
  const [bannerPosition, setBannerPosition] = useState({ x: 50, y: 120 });
  const [bannerRotation, setBannerRotation] = useState(-15);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

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

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === bannerRef.current || bannerRef.current?.contains(e.target as Node)) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - bannerPosition.x,
        y: e.clientY - bannerPosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setBannerPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsRotating(false);
  };

  // Rotation handlers
  const handleRotationStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    const rect = bannerRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      setRotationStart(angle - bannerRotation);
    }
  };

  const handleRotationMove = (e: React.MouseEvent) => {
    if (isRotating) {
      const rect = bannerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        setBannerRotation(angle - rotationStart);
      }
    }
  };

  const lockPosition = () => {
    setPositioningMode(false);
    console.log(`Final position: X: ${bannerPosition.x}px, Y: ${bannerPosition.y}px, Rotation: ${bannerRotation.toFixed(1)}deg`);
  };

  const handleSearch = () => {
    console.log('Searching for:', { location, category: selectedCategory });
    navigate('/services');
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center px-4"
      onMouseMove={positioningMode ? (isDragging ? handleMouseMove : isRotating ? handleRotationMove : undefined) : undefined}
      onMouseUp={positioningMode ? handleMouseUp : undefined}
    >
      {/* Grid Overlay - Only in positioning mode */}
      {positioningMode && (
        <div 
          className="fixed inset-0 z-[9998] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      )}

      {/* Positioning Controls - Only in positioning mode */}
      {positioningMode && (
        <div className="fixed top-4 left-4 z-[9999] bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg">
          <div className="text-sm font-bold mb-2 text-yellow-400">🔧 POSITIONING MODE</div>
          <div className="text-xs space-y-1 mb-3">
            <div>X: {bannerPosition.x}px, Y: {bannerPosition.y}px</div>
            <div>Rotation: {bannerRotation.toFixed(1)}°</div>
          </div>
          <Button 
            onClick={lockPosition}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Lock className="h-3 w-3 mr-1" />
            Lock Position
          </Button>
        </div>
      )}

      {/* Certn Banner - Draggable/Rotatable */}
      <div 
        ref={bannerRef}
        className={`absolute z-[9999] flex items-center space-x-2 fintech-card backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg cursor-move ${
          positioningMode ? 'border-2 border-yellow-400 border-dashed' : ''
        }`}
        style={{ 
          left: `${bannerPosition.x}px`,
          top: `${bannerPosition.y}px`,
          transform: `rotate(${bannerRotation}deg)`,
          userSelect: 'none'
        }}
        onMouseDown={positioningMode ? handleMouseDown : undefined}
      >
        <img 
          src="/CERTN.png" 
          alt="Certn" 
          className="h-6 w-auto"
        />
        <span className="text-sm font-medium text-gray-800">
          Free background check with annual premium!
        </span>
        
        {/* Rotation Handles - Only in positioning mode */}
        {positioningMode && (
          <>
            <div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full cursor-grab border-2 border-white shadow-lg flex items-center justify-center"
              onMouseDown={handleRotationStart}
              title="Drag to rotate"
            >
              <RotateCw className="h-2 w-2 text-black" />
            </div>
            <div 
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full cursor-grab border-2 border-white shadow-lg flex items-center justify-center"
              onMouseDown={handleRotationStart}
              title="Drag to rotate"
            >
              <RotateCw className="h-2 w-2 text-black" />
            </div>
          </>
        )}
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
