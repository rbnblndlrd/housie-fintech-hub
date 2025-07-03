
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
  const [positioningMode, setPositioningMode] = useState(false);
  
  // Certn Banner state
  const [bannerPosition, setBannerPosition] = useState({ x: 50, y: 120 });
  const [bannerRotation, setBannerRotation] = useState(-15);
  const [bannerSize, setBannerSize] = useState({ width: 300, height: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState(0);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const bannerRef = useRef<HTMLDivElement>(null);
  
  // Dashboard Graffiti state
  const [dashboardPosition, setDashboardPosition] = useState({ x: 290, y: 120 });
  const [dashboardRotation, setDashboardRotation] = useState(0);
  const [dashboardSize, setDashboardSize] = useState({ width: 350, height: 120 });
  const [isDashboardDragging, setIsDashboardDragging] = useState(false);
  const [isDashboardRotating, setIsDashboardRotating] = useState(false);
  const [isDashboardResizing, setIsDashboardResizing] = useState(false);
  const [dashboardDragStart, setDashboardDragStart] = useState({ x: 0, y: 0 });
  const [dashboardRotationStart, setDashboardRotationStart] = useState(0);
  const [dashboardResizeStart, setDashboardResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const dashboardRef = useRef<HTMLDivElement>(null);

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

  // Banner handlers
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
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      setBannerSize({
        width: Math.max(100, resizeStart.width + deltaX),
        height: Math.max(40, resizeStart.height + deltaY)
      });
    } else if (isDashboardDragging) {
      setDashboardPosition({
        x: e.clientX - dashboardDragStart.x,
        y: e.clientY - dashboardDragStart.y
      });
    } else if (isDashboardResizing) {
      const deltaX = e.clientX - dashboardResizeStart.x;
      const deltaY = e.clientY - dashboardResizeStart.y;
      setDashboardSize({
        width: Math.max(100, dashboardResizeStart.width + deltaX),
        height: Math.max(40, dashboardResizeStart.height + deltaY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsRotating(false);
    setIsResizing(false);
    setIsDashboardDragging(false);
    setIsDashboardRotating(false);
    setIsDashboardResizing(false);
  };

  // Banner rotation handlers
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
    } else if (isDashboardRotating) {
      const rect = dashboardRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        setDashboardRotation(angle - dashboardRotationStart);
      }
    }
  };

  // Banner resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: bannerSize.width,
      height: bannerSize.height
    });
  };

  // Dashboard handlers
  const handleDashboardMouseDown = (e: React.MouseEvent) => {
    if (e.target === dashboardRef.current || dashboardRef.current?.contains(e.target as Node)) {
      setIsDashboardDragging(true);
      setDashboardDragStart({
        x: e.clientX - dashboardPosition.x,
        y: e.clientY - dashboardPosition.y
      });
    }
  };

  const handleDashboardRotationStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDashboardRotating(true);
    const rect = dashboardRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      setDashboardRotationStart(angle - dashboardRotation);
    }
  };

  const handleDashboardResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDashboardResizing(true);
    setDashboardResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: dashboardSize.width,
      height: dashboardSize.height
    });
  };

  const lockPosition = () => {
    setPositioningMode(false);
    console.log(`Certn Banner - X: ${bannerPosition.x}px, Y: ${bannerPosition.y}px, Rotation: ${bannerRotation.toFixed(1)}deg, Size: ${bannerSize.width}x${bannerSize.height}`);
    console.log(`Dashboard - X: ${dashboardPosition.x}px, Y: ${dashboardPosition.y}px, Rotation: ${dashboardRotation.toFixed(1)}deg, Size: ${dashboardSize.width}x${dashboardSize.height}`);
  };

  const handleSearch = () => {
    console.log('Searching for:', { location, category: selectedCategory });
    navigate('/services');
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center px-4"
      onMouseMove={positioningMode ? (isDragging || isDashboardDragging || isResizing || isDashboardResizing ? handleMouseMove : isRotating || isDashboardRotating ? handleRotationMove : undefined) : undefined}
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

      {/* Certn Banner - Draggable/Rotatable/Resizable */}
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
        onMouseDown={positioningMode ? handleMouseDown : undefined}
      >
        <img 
          src="/CERTN.png" 
          alt="Certn" 
          className="h-6 w-auto flex-shrink-0"
        />
        <span className="text-sm font-medium text-gray-800 flex-grow overflow-hidden">
          Free background check with annual premium!
        </span>
        
        {/* Control Handles - Only in positioning mode */}
        {positioningMode && (
          <>
            {/* Rotation Handles */}
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
            
            {/* Resize Handle */}
            <div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400 rounded-full cursor-se-resize border-2 border-white shadow-lg flex items-center justify-center"
              onMouseDown={handleResizeStart}
              title="Drag to resize"
            >
              <Maximize2 className="h-2 w-2 text-black" />
            </div>
          </>
        )}
      </div>

      {/* Dashboard Graffiti - Draggable/Rotatable/Resizable */}
      <div 
        ref={dashboardRef}
        className={`absolute z-[9999] flex flex-col items-center justify-center cursor-move ${
          positioningMode ? 'border-2 border-green-400 border-dashed' : ''
        }`}
        style={{ 
          left: `${dashboardPosition.x}px`,
          top: `${dashboardPosition.y}px`,
          width: `${dashboardSize.width}px`,
          height: `${dashboardSize.height}px`,
          transform: `rotate(${dashboardRotation}deg)`,
          userSelect: 'none',
          textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9)'
        }}
        onMouseDown={positioningMode ? handleDashboardMouseDown : undefined}
      >
        <div className="text-white hover:scale-105 transition-transform duration-300 flex flex-col items-center h-full w-full justify-center">
          <span className="font-graffiti text-7xl font-bold tracking-wider">DASHBOARD</span>
          <span className="dashboard-arrows text-4xl mt-1"></span>
        </div>
        
        {/* Control Handles - Only in positioning mode */}
        {positioningMode && (
          <>
            {/* Rotation Handles */}
            <div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full cursor-grab border-2 border-white shadow-lg flex items-center justify-center"
              onMouseDown={handleDashboardRotationStart}
              title="Drag to rotate"
            >
              <RotateCw className="h-2 w-2 text-black" />
            </div>
            <div 
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full cursor-grab border-2 border-white shadow-lg flex items-center justify-center"
              onMouseDown={handleDashboardRotationStart}
              title="Drag to rotate"
            >
              <RotateCw className="h-2 w-2 text-black" />
            </div>
            
            {/* Resize Handle */}
            <div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400 rounded-full cursor-se-resize border-2 border-white shadow-lg flex items-center justify-center"
              onMouseDown={handleDashboardResizeStart}
              title="Drag to resize"
            >
              <Maximize2 className="h-2 w-2 text-black" />
            </div>
          </>
        )}
      </div>

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
