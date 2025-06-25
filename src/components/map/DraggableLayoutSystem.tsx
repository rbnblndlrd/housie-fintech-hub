
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Settings, 
  Crown, 
  GripVertical, 
  Minimize2, 
  RotateCcw,
  Save,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DraggableBox {
  id: string;
  title: string;
  content: React.ReactNode;
  position: 'right' | 'bottom' | 'overMap' | 'left';
  minimized: boolean;
  order: number;
}

interface DropZone {
  id: 'right' | 'bottom' | 'overMap' | 'left';
  label: string;
  className: string;
}

interface DraggableLayoutSystemProps {
  boxes: DraggableBox[];
  onLayoutChange: (boxes: DraggableBox[]) => void;
  isPremium: boolean;
  children: React.ReactNode; // Map component
}

const dropZones: DropZone[] = [
  { id: 'overMap', label: 'Over Map', className: 'absolute inset-4 border-2 border-dashed border-blue-400 bg-blue-50/20 rounded-lg' },
  { id: 'left', label: 'Left Side', className: 'absolute left-0 top-0 bottom-0 w-80 border-2 border-dashed border-green-400 bg-green-50/20' },
  { id: 'right', label: 'Right Side', className: 'absolute right-0 top-0 bottom-0 w-80 border-2 border-dashed border-orange-400 bg-orange-50/20' },
  { id: 'bottom', label: 'Bottom', className: 'absolute bottom-0 left-0 right-0 h-64 border-2 border-dashed border-purple-400 bg-purple-50/20' }
];

const DraggableLayoutSystem: React.FC<DraggableLayoutSystemProps> = ({
  boxes,
  onLayoutChange,
  isPremium,
  children
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draggedBox, setDraggedBox] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [localBoxes, setLocalBoxes] = useState<DraggableBox[]>(boxes);
  const { toast } = useToast();

  useEffect(() => {
    setLocalBoxes(boxes);
  }, [boxes]);

  const handleDragStart = (e: React.DragEvent, boxId: string) => {
    if (!isPremium || !isCustomizing) return;
    setDraggedBox(boxId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    if (!isPremium || !isCustomizing) return;
    setDragOverZone(zoneId);
  };

  const handleDragLeave = () => {
    setDragOverZone(null);
  };

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    if (!draggedBox || !isPremium || !isCustomizing) return;

    const updatedBoxes = localBoxes.map(box => 
      box.id === draggedBox 
        ? { ...box, position: zoneId as any }
        : box
    );

    setLocalBoxes(updatedBoxes);
    setDraggedBox(null);
    setDragOverZone(null);
    
    toast({
      title: "Box Moved",
      description: `Moved to ${zoneId} area`,
    });
  };

  const handleMinimize = (boxId: string) => {
    const updatedBoxes = localBoxes.map(box =>
      box.id === boxId ? { ...box, minimized: !box.minimized } : box
    );
    setLocalBoxes(updatedBoxes);
  };

  const handleSaveLayout = () => {
    if (!isPremium) return;
    onLayoutChange(localBoxes);
    localStorage.setItem('housie-map-layout', JSON.stringify(localBoxes));
    toast({
      title: "Layout Saved",
      description: "Your custom layout has been saved",
    });
  };

  const handleResetLayout = () => {
    const resetBoxes = boxes.map(box => ({ ...box, position: 'right' as const, minimized: false }));
    setLocalBoxes(resetBoxes);
    localStorage.removeItem('housie-map-layout');
    toast({
      title: "Layout Reset",
      description: "Layout restored to default",
    });
  };

  const handleShowAllBoxes = () => {
    const updatedBoxes = localBoxes.map(box => ({ ...box, minimized: false }));
    setLocalBoxes(updatedBoxes);
  };

  const toggleCustomization = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to customize your layout",
        variant: "destructive"
      });
      return;
    }
    setIsCustomizing(!isCustomizing);
  };

  const renderBox = (box: DraggableBox, isFloating = false) => (
    <Card 
      key={box.id}
      className={`
        ${isFloating ? 'bg-white/90 backdrop-blur-sm shadow-lg' : ''}
        ${box.minimized ? 'hidden' : ''}
        ${isCustomizing ? 'cursor-move border-blue-300' : ''}
        transition-all duration-200
      `}
      draggable={isPremium && isCustomizing}
      onDragStart={(e) => handleDragStart(e, box.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {isCustomizing && isPremium && (
              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
            )}
            {box.title}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleMinimize(box.id)}
              className="h-6 w-6 p-0"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {box.content}
      </CardContent>
    </Card>
  );

  const renderMinimizedTabs = () => {
    const minimizedBoxes = localBoxes.filter(box => box.minimized);
    if (minimizedBoxes.length === 0) return null;

    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {minimizedBoxes.map(box => (
          <Button
            key={box.id}
            size="sm"
            variant="outline"
            onClick={() => handleMinimize(box.id)}
            className="bg-white/90 backdrop-blur-sm shadow-lg"
          >
            {box.title}
          </Button>
        ))}
      </div>
    );
  };

  const getBoxesByPosition = (position: string) => 
    localBoxes.filter(box => box.position === position && !box.minimized);

  return (
    <div className="h-full flex flex-col relative">
      {/* Header Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        {localBoxes.some(box => box.minimized) && (
          <Button size="sm" variant="outline" onClick={handleShowAllBoxes}>
            <Eye className="h-4 w-4 mr-1" />
            Show All
          </Button>
        )}
        
        {isCustomizing && isPremium && (
          <>
            <Button size="sm" variant="outline" onClick={handleSaveLayout}>
              <Save className="h-4 w-4 mr-1" />
              Save Layout
            </Button>
            <Button size="sm" variant="outline" onClick={handleResetLayout}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={isCustomizing ? "default" : "outline"}
                onClick={toggleCustomization}
                className="relative"
              >
                <Settings className="h-4 w-4 mr-1" />
                Customize Layout
                {!isPremium && (
                  <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isPremium ? "Drag boxes to customize layout" : "Premium feature - upgrade to unlock"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 flex relative">
        {/* Left Sidebar */}
        {getBoxesByPosition('left').length > 0 && (
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 space-y-4">
            {getBoxesByPosition('left').map(box => renderBox(box))}
          </div>
        )}

        {/* Main Map Area */}
        <div className="flex-1 relative">
          {children}
          
          {/* Over Map Boxes */}
          {getBoxesByPosition('overMap').map((box, index) => (
            <div
              key={box.id}
              className="absolute top-4 left-4 w-80 z-10"
              style={{ top: `${4 + index * 200}px` }}
            >
              {renderBox(box, true)}
            </div>
          ))}

          {/* Minimized Tabs */}
          {renderMinimizedTabs()}

          {/* Drop Zones (only visible during customization) */}
          {isCustomizing && isPremium && (
            <>
              {dropZones.map(zone => (
                <div
                  key={zone.id}
                  className={`${zone.className} ${dragOverZone === zone.id ? 'opacity-100' : 'opacity-0'} 
                    transition-opacity duration-200 flex items-center justify-center`}
                  onDragOver={(e) => handleDragOver(e, zone.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, zone.id)}
                >
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg font-medium">
                    Drop here: {zone.label}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Sidebar */}
        {getBoxesByPosition('right').length > 0 && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-4 space-y-4">
            {getBoxesByPosition('right').map(box => renderBox(box))}
          </div>
        )}
      </div>

      {/* Bottom Row */}
      {getBoxesByPosition('bottom').length > 0 && (
        <div className="h-64 bg-white border-t border-gray-200 overflow-y-auto">
          <div className="p-4 grid grid-cols-3 gap-4 h-full">
            {getBoxesByPosition('bottom').map(box => renderBox(box))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableLayoutSystem;
