
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { getLoyaltyMenuItems } from '@/components/gamification/LoyaltyMenuItems';
import { useNavigate } from 'react-router-dom';
import { Star, Gift, Trophy, Zap } from 'lucide-react';

const HiddenLoyaltySection = () => {
  const { currentRole } = useRoleSwitch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const loyaltyMenuItems = getLoyaltyMenuItems(currentRole);

  const handleItemClick = (item: any) => {
    if (item.href) {
      navigate(item.href);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg opacity-60 hover:opacity-100 transition-all duration-300 border-2 border-white/20"
          >
            <Star className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 mr-4 mb-2"
          align="end"
          side="top"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Loyalty & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loyaltyMenuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm font-normal h-8"
                  onClick={() => handleItemClick(item)}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                </Button>
              ))}
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Discover rewards</span>
                  <Gift className="h-3 w-3 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HiddenLoyaltySection;
