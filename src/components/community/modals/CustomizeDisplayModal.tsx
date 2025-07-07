import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Star, Award } from 'lucide-react';

interface CustomizeDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomizeDisplayModal = ({ isOpen, onClose }: CustomizeDisplayModalProps) => {
  const [selectedRank, setSelectedRank] = useState('technomancer');
  const [selectedRecognition, setSelectedRecognition] = useState('quality');

  const rankOptions = [
    { id: 'technomancer', title: 'Technomancer ⚡', description: 'Appliance & Tech Repair' },
    { id: 'quality_expert', title: 'Quality Expert ⭐', description: 'Recognition Achievement' },
    { id: 'network_navigator', title: 'Network Navigator 🌐', description: 'Community Achievement' }
  ];

  const recognitionOptions = [
    { id: 'quality', title: 'Quality Expert ⭐', description: '23 Quality Recognition Points' },
    { id: 'courtesy', title: 'Courtesy Champion 💬', description: '31 Courtesy Recognition Points' },
    { id: 'reliability', title: 'Reliability Pro 🛡️', description: '18 Reliability Recognition Points' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customize Public Display
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Rank Display Section */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Choose Your Rank Display
            </h3>
            <div className="space-y-3">
              {rankOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all ${selectedRank === option.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedRank(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{option.title}</p>
                        <p className="text-sm opacity-70">{option.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${selectedRank === option.id ? 'bg-primary border-primary' : 'border-muted'}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recognition Display Section */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Choose Your Recognition Display
            </h3>
            <div className="space-y-3">
              {recognitionOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all ${selectedRecognition === option.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedRecognition(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{option.title}</p>
                        <p className="text-sm opacity-70">{option.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${selectedRecognition === option.id ? 'bg-primary border-primary' : 'border-muted'}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeDisplayModal;