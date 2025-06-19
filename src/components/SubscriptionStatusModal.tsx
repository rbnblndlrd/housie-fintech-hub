import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface SubscriptionStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionStatusModal: React.FC<SubscriptionStatusModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { subscriptionData } = useSubscription();

  const handleCompareTiers = () => {
    onOpenChange(false);
    navigate('/');
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing-section');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Define features for each tier
  const tierFeatures = {
    free: [
      {
        name: "Services de base",
        description: "Access to basic home services booking"
      },
      {
        name: "Recherche locale",
        description: "Find service providers in your area"
      },
      {
        name: "Évaluations et avis",
        description: "View ratings and reviews from other users"
      }
    ],
    starter: [
      {
        name: "Services illimités",
        description: "Book unlimited home services without restrictions"
      },
      {
        name: "Réservations groupées",
        description: "Bundle multiple jobs together for better rates"
      },
      {
        name: "Support prioritaire",
        description: "Get faster response times for support requests"
      },
      {
        name: "Rapports de base",
        description: "Basic expense tracking and reporting"
      }
    ],
    premium: [
      {
        name: "Services illimités",
        description: "Book unlimited home services without restrictions"
      },
      {
        name: "Réservations groupées",
        description: "Bundle multiple jobs together for better rates"
      },
      {
        name: "IA avancée + automation",
        description: "Smart scheduling and cost optimization"
      },
      {
        name: "Rapports fiscaux détaillés",
        description: "Comprehensive tax reports and CSV exports"
      },
      {
        name: "Support chat en direct",
        description: "24/7 live chat support for immediate assistance"
      },
      {
        name: "Intégration calendrier",
        description: "Sync with Google Calendar and other apps"
      }
    ],
    pro: [
      {
        name: "Services illimités",
        description: "Book unlimited home services without restrictions"
      },
      {
        name: "Réservations groupées",
        description: "Bundle multiple jobs together for better rates"
      },
      {
        name: "IA avancée + automation",
        description: "Smart scheduling and cost optimization"
      },
      {
        name: "Rapports fiscaux détaillés",
        description: "Detailed tax reports and professional exports"
      },
      {
        name: "Support téléphonique",
        description: "Priority phone support 24/7 with dedicated line"
      },
      {
        name: "API access",
        description: "Custom integrations and enterprise features"
      },
      {
        name: "Gestionnaire de compte",
        description: "Dedicated account manager for business needs"
      }
    ]
  };

  const currentTier = subscriptionData.subscription_tier?.toLowerCase() || 'free';
  const features = tierFeatures[currentTier as keyof typeof tierFeatures] || tierFeatures.free;

  const getTierIcon = (tier: string) => {
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      case 'starter':
        return 'bg-gradient-to-r from-green-500 to-teal-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tierDisplayName = currentTier.charAt(0).toUpperCase() + currentTier.slice(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-3">
            <span className="text-3xl mr-2">{getTierIcon(currentTier)}</span>
            <Badge className={`text-lg px-4 py-2 rounded-xl font-bold ${getTierColor(currentTier)}`}>
              Plan {tierDisplayName}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Your Current Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  {feature.name}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={handleCompareTiers}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 hover:bg-gray-50"
          >
            <span>📊 Compare Subscription Tiers</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionStatusModal;
