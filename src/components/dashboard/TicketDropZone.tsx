
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, Target, Zap } from 'lucide-react';

interface TicketDropZoneProps {
  draggedTicket: any;
  onDrop: () => void;
}

const TicketDropZone = ({ draggedTicket, onDrop }: TicketDropZoneProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <Card className="autumn-card-fintech-xl h-[400px]" onDragOver={handleDragOver} onDrop={handleDrop}>
      <CardContent className="p-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900">AI Job Optimizer</h3>
              <p className="text-lg text-gray-600">Drop tickets here for intelligent scheduling</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-lg font-bold">
            Claude AI Powered
          </Badge>
        </div>

        <div className="border-4 border-dashed border-purple-300 rounded-2xl h-64 bg-purple-50/50 flex flex-col items-center justify-center relative overflow-hidden">
          {draggedTicket ? (
            <div className="text-center">
              <div className="animate-bounce mb-4">
                <Target className="h-16 w-16 text-purple-600 mx-auto" />
              </div>
              <p className="text-2xl font-bold text-purple-700">Release to optimize!</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <Sparkles className="h-20 w-20 text-purple-400 mx-auto animate-pulse" />
              </div>
              <h4 className="text-2xl font-bold text-gray-700 mb-3">Smart Job Processing Zone</h4>
              <p className="text-lg text-gray-600 mb-6 max-w-md">
                Drag tickets here to automatically optimize routes, assign crew, and schedule efficiently
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-4 text-lg font-bold shadow-xl">
                <Zap className="h-5 w-5 mr-2" />
                Auto-Process Queue
              </Button>
            </div>
          )}
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 left-12 w-1 h-1 bg-purple-500 rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketDropZone;
