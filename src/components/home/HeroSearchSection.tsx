import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, Move, RotateCw, Lock, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSearchSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  
  // Positioning mode state
  const [positioningMode, setPositioningMode] = useState(true);
  
  // Object management state
  const [activeObject, setActiveObject] = useState<string | null>(null);
  
  // Certn Banner state
  const [bannerPosition, setBannerPosition] = useState({ x: -32, y: 1382 });
  const [bannerRotation, setBannerRotation] = useState(28.7);
  const [bannerSize, setBannerSize] = useState({ width: 304, height: 97 });
  
  // Dashboard Text state (separate from arrows)
  const [dashboardTextPosition, setDashboardTextPosition] = useState({ x: 2156, y: 430 });
  const [dashboardTextRotation, setDashboardTextRotation] = useState(1.0);
  const [dashboardTextSize, setDashboardTextSize] = useState({ width: 351, height: 50 });
  
  // Dashboard Arrows state (separate from text)
  const [dashboardArrowsPosition, setDashboardArrowsPosition] = useState({ x: 2156, y: 485 });
  const [dashboardArrowsRotation, setDashboardArrowsRotation] = useState(1.0);
  const [dashboardArrowsSize, setDashboardArrowsSize] = useState({ width: 351, height: 68 });
  
  // Hero Title state
  const [heroTitlePosition, setHeroTitlePosition] = useState({ x: 300, y: 200 });
  const [heroTitleRotation, setHeroTitleRotation] = useState(0);
  const [heroTitleSize, setHeroTitleSize] = useState({ width: 800, height: 150 });
  
  // Search Section state
  const [searchSectionPosition, setSearchSectionPosition] = useState({ x: 300, y: 400 });
  const [searchSectionRotation, setSearchSectionRotation] = useState(0);
  const [searchSectionSize, setSearchSectionSize] = useState({ width: 800, height: 200 });
  
  // Universal interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState(0);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Refs for all objects
  const bannerRef = useRef<HTMLDivElement>(null);
  const dashboardTextRef = useRef<HTMLDivElement>(null);
  const dashboardArrowsRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);

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

  // Universal object manipulation handlers
  const getObjectState = (objectType: string) => {
    switch (objectType) {
      case 'banner':
        return { position: bannerPosition, rotation: bannerRotation, size: bannerSize, setter: { position: setBannerPosition, rotation: setBannerRotation, size: setBannerSize } };
      case 'dashboardText':
        return { position: dashboardTextPosition, rotation: dashboardTextRotation, size: dashboardTextSize, setter: { position: setDashboardTextPosition, rotation: setDashboardTextRotation, size: setDashboardTextSize } };
      case 'dashboardArrows':
        return { position: dashboardArrowsPosition, rotation: dashboardArrowsRotation, size: dashboardArrowsSize, setter: { position: setDashboardArrowsPosition, rotation: setDashboardArrowsRotation, size: setDashboardArrowsSize } };
      case 'heroTitle':
        return { position: heroTitlePosition, rotation: heroTitleRotation, size: heroTitleSize, setter: { position: setHeroTitlePosition, rotation: setHeroTitleRotation, size: setHeroTitleSize } };
      case 'searchSection':
        return { position: searchSectionPosition, rotation: searchSectionRotation, size: searchSectionSize, setter: { position: setSearchSectionPosition, rotation: setSearchSectionRotation, size: setSearchSectionSize } };
      default:
        return null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent, objectType: string) => {
    const objectState = getObjectState(objectType);
    if (!objectState) return;
    
    setActiveObject(objectType);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - objectState.position.x,
      y: e.clientY - objectState.position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeObject) return;
    
    const objectState = getObjectState(activeObject);
    if (!objectState) return;

    if (isDragging) {
      objectState.setter.position({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      objectState.setter.size({
        width: Math.max(100, resizeStart.width + deltaX),
        height: Math.max(40, resizeStart.height + deltaY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsRotating(false);
    setIsResizing(false);
    setActiveObject(null);
  };

  const handleRotationStart = (e: React.MouseEvent, objectType: string) => {
    e.stopPropagation();
    const objectState = getObjectState(objectType);
    if (!objectState) return;
    
    setActiveObject(objectType);
    setIsRotating(true);
    
    const ref = objectType === 'banner' ? bannerRef :
                objectType === 'dashboardText' ? dashboardTextRef :
                objectType === 'dashboardArrows' ? dashboardArrowsRef :
                objectType === 'heroTitle' ? heroTitleRef : searchSectionRef;
    
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      setRotationStart(angle - objectState.rotation);
    }
  };

  const handleRotationMove = (e: React.MouseEvent) => {
    if (!isRotating || !activeObject) return;
    
    const objectState = getObjectState(activeObject);
    if (!objectState) return;
    
    const ref = activeObject === 'banner' ? bannerRef :
                activeObject === 'dashboardText' ? dashboardTextRef :
                activeObject === 'dashboardArrows' ? dashboardArrowsRef :
                activeObject === 'heroTitle' ? heroTitleRef : searchSectionRef;
    
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      objectState.setter.rotation(angle - rotationStart);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, objectType: string) => {
    e.stopPropagation();
    const objectState = getObjectState(objectType);
    if (!objectState) return;
    
    setActiveObject(objectType);
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: objectState.size.width,
      height: objectState.size.height
    });
  };

  const lockPosition = () => {
    setPositioningMode(false);
    console.log(`Certn Banner - X: ${bannerPosition.x}px, Y: ${bannerPosition.y}px, Rotation: ${bannerRotation.toFixed(1)}deg, Size: ${bannerSize.width}x${bannerSize.height}`);
    console.log(`Dashboard Text - X: ${dashboardTextPosition.x}px, Y: ${dashboardTextPosition.y}px, Rotation: ${dashboardTextRotation.toFixed(1)}deg, Size: ${dashboardTextSize.width}x${dashboardTextSize.height}`);
    console.log(`Dashboard Arrows - X: ${dashboardArrowsPosition.x}px, Y: ${dashboardArrowsPosition.y}px, Rotation: ${dashboardArrowsRotation.toFixed(1)}deg, Size: ${dashboardArrowsSize.width}x${dashboardArrowsSize.height}`);
  };

  const handleSearch = () => {
    console.log('Searching for:', { location, category: selectedCategory });
    navigate('/services');
  };

  const getObjectHandles = (objectType: string, colorClass: string) => {
    if (!positioningMode) return null;
    
    return (
      <>
        {/* Rotation Handles */}
        <div 
          className={`absolute -top-2 -right-2 w-4 h-4 ${colorClass} rounded-full cursor-grab border-2 border-white shadow-lg flex items-center justify-center`}
          onMouseDown={(e) => handleRotationStart(e, objectType)}
          title="Drag to rotate"
        >
          <RotateCw className="h-2 w-2 text-black" />
        </div>
        <div 
          className={`absolute -bottom-2 -left-2 w-4 h-4 ${colorClass} rounded-full cursor-grab border-2 border-white shadow-lg flex items-center justify-center`}
          onMouseDown={(e) => handleRotationStart(e, objectType)}
          title="Drag to rotate"
        >
          <RotateCw className="h-2 w-2 text-black" />
        </div>
        
        {/* Resize Handle */}
        <div 
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400 rounded-full cursor-se-resize border-2 border-white shadow-lg flex items-center justify-center"
          onMouseDown={(e) => handleResizeStart(e, objectType)}
          title="Drag to resize"
        >
          <Maximize2 className="h-2 w-2 text-black" />
        </div>
      </>
    );
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center px-4"
      onMouseMove={positioningMode ? (isDragging || isResizing ? handleMouseMove : isRotating ? handleRotationMove : undefined) : undefined}
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

      {/* Enhanced Positioning Controls */}
      {positioningMode && (
        <div className="fixed top-4 left-4 z-[9999] bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg max-w-sm">
          <div className="text-sm font-bold mb-2 text-yellow-400">🔧 OBJECT POSITIONING</div>
          
          {/* Active Object Info */}
          {activeObject && (
            <div className="text-xs mb-3 p-2 bg-white/10 rounded">
              <div className="font-bold text-green-400">Active: {activeObject}</div>
              <div>X: {getObjectState(activeObject)?.position.x}px, Y: {getObjectState(activeObject)?.position.y}px</div>
              <div>Rotation: {getObjectState(activeObject)?.rotation.toFixed(1)}°</div>
              <div>Size: {getObjectState(activeObject)?.size.width}x{getObjectState(activeObject)?.size.height}</div>
            </div>
          )}
          
          {/* Object Legend */}
          <div className="text-xs mb-3 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span>Certn Banner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span>Dashboard Text</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span>Dashboard Arrows</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span>Hero Title</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded"></div>
              <span>Search Section</span>
            </div>
          </div>
          
          <Button 
            onClick={lockPosition}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Lock className="h-3 w-3 mr-1" />
            Lock All Positions
          </Button>
        </div>
      )}

      {/* Certn Banner */}
      <div 
        ref={bannerRef}
        className={`absolute z-[9999] flex items-center space-x-2 fintech-card backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg cursor-move ${
          positioningMode ? 'border-2 border-yellow-400 border-dashed' : ''
        }`}
        style={{ 
          left: `${bannerPosition.x}px`,
          top: `${bannerPosition.y}px`,
          width: `${bannerSize.width}px`,
          height: `${bannerSize.height}px`,
          transform: `rotate(${bannerRotation}deg)`,
          userSelect: 'none'
        }}
        onMouseDown={positioningMode ? (e) => handleMouseDown(e, 'banner') : undefined}
      >
        <img 
          src="/CERTN.png" 
          alt="Certn" 
          className="h-6 w-auto flex-shrink-0"
        />
        <span className="text-sm font-medium text-gray-800 flex-grow overflow-hidden">
          Free background check with annual premium!
        </span>
        {getObjectHandles('banner', 'bg-yellow-400')}
      </div>

      {/* Dashboard Text (separate from arrows, no link) */}
      <div 
        ref={dashboardTextRef}
        className={`absolute z-[9999] flex items-center justify-center cursor-move ${
          positioningMode ? 'border-2 border-red-400 border-dashed' : ''
        }`}
        style={{ 
          left: `${dashboardTextPosition.x}px`,
          top: `${dashboardTextPosition.y}px`,
          width: `${dashboardTextSize.width}px`,
          height: `${dashboardTextSize.height}px`,
          transform: `rotate(${dashboardTextRotation}deg)`,
          userSelect: 'none',
          textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)'
        }}
        onMouseDown={positioningMode ? (e) => handleMouseDown(e, 'dashboardText') : undefined}
      >
        <span className="font-sans text-4xl font-extrabold tracking-wider uppercase text-white">DASHBOARD</span>
        {getObjectHandles('dashboardText', 'bg-red-400')}
      </div>

      {/* Dashboard Arrows (separate, animated) */}
      <div 
        ref={dashboardArrowsRef}
        className={`absolute z-[9999] flex items-center justify-center cursor-move ${
          positioningMode ? 'border-2 border-blue-400 border-dashed' : ''
        }`}
        style={{ 
          left: `${dashboardArrowsPosition.x}px`,
          top: `${dashboardArrowsPosition.y}px`,
          width: `${dashboardArrowsSize.width}px`,
          height: `${dashboardArrowsSize.height}px`,
          transform: `rotate(${dashboardArrowsRotation}deg)`,
          userSelect: 'none',
          textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)'
        }}
        onMouseDown={positioningMode ? (e) => handleMouseDown(e, 'dashboardArrows') : undefined}
      >
        <div className="text-white text-5xl tracking-wider animate-pulse">➤➤➤</div>
        {getObjectHandles('dashboardArrows', 'bg-blue-400')}
      </div>

      {/* Hero Title */}
      <div 
        ref={heroTitleRef}
        className={`absolute z-10 cursor-move ${
          positioningMode ? 'border-2 border-green-400 border-dashed' : ''
        }`}
        style={{ 
          left: `${heroTitlePosition.x}px`,
          top: `${heroTitlePosition.y}px`,
          width: `${heroTitleSize.width}px`,
          height: `${heroTitleSize.height}px`,
          transform: `rotate(${heroTitleRotation}deg)`,
          userSelect: 'none'
        }}
        onMouseDown={positioningMode ? (e) => handleMouseDown(e, 'heroTitle') : undefined}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-shadow-lg text-center">
          Find local experts near you
        </h1>
        {getObjectHandles('heroTitle', 'bg-green-400')}
      </div>

      {/* Search Section */}
      <div 
        ref={searchSectionRef}
        className={`absolute z-10 cursor-move ${
          positioningMode ? 'border-2 border-purple-400 border-dashed' : ''
        }`}
        style={{ 
          left: `${searchSectionPosition.x}px`,
          top: `${searchSectionPosition.y}px`,
          width: `${searchSectionSize.width}px`,
          height: `${searchSectionSize.height}px`,
          transform: `rotate(${searchSectionRotation}deg)`,
          userSelect: 'none'
        }}
        onMouseDown={positioningMode ? (e) => handleMouseDown(e, 'searchSection') : undefined}
      >
        {/* Search Bar */}
        <div className="fintech-card rounded-lg shadow-2xl p-2 flex flex-col sm:flex-row gap-2 mb-6">
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

        <p className="text-white/90 text-shadow drop-shadow-lg text-center">
          Or{' '}
          <Link to="/auth" className="underline font-medium text-white hover:text-white/80">
            Sign In
          </Link>
        </p>
        {getObjectHandles('searchSection', 'bg-purple-400')}
      </div>
    </div>
  );
};

export default HeroSearchSection;