
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSubscription } from '@/contexts/SubscriptionContext';
import SubscriptionStatusModal from '@/components/SubscriptionStatusModal';
import LanguageToggle from '@/components/LanguageToggle';
import NotificationBell from '@/components/NotificationBell';

const HeaderActions = () => {
  const { subscriptionData, loading: subscriptionLoading } = useSubscription();
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  const handleDiamondClick = () => {
    setSubscriptionModalOpen(true);
  };

  const getDiamondIcon = () => {
    if (subscriptionLoading) return '💎';
    
    const tier = subscriptionData.subscription_tier?.toLowerCase() || 'free';
    switch (tier) {
      case 'pro':
        return '🏆';
      case 'premium':
        return '💎';
      case 'starter':
        return '🚀';
      default:
        return '🆓';
    }
  };

  const getDiamondTooltip = () => {
    if (subscriptionLoading) return 'Loading subscription...';
    
    const tier = subscriptionData.subscription_tier || 'free';
    return `Current plan: ${tier.charAt(0).toUpperCase() + tier.slice(1)}`;
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <LanguageToggle />
        
        {/* Notification Bell */}
        <NotificationBell />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiamondClick}
              className="text-white hover:text-gray-300 hover:bg-gray-800 text-lg w-10 h-10 p-0"
            >
              {getDiamondIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getDiamondTooltip()}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <SubscriptionStatusModal 
        open={subscriptionModalOpen} 
        onOpenChange={setSubscriptionModalOpen} 
      />
    </>
  );
};

export default HeaderActions;
