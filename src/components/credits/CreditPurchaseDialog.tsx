
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Star, Zap, Crown } from 'lucide-react';
import { useCredits, CreditPackage } from '@/hooks/useCredits';
import { toast } from 'sonner';

interface CreditPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreditPurchaseDialog: React.FC<CreditPurchaseDialogProps> = ({ open, onOpenChange }) => {
  const { packages, addCredits } = useCredits();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setPurchasing(packageId);
    
    try {
      const success = await addCredits(packageId);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const getPackageIcon = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case 'starter pack':
        return <Zap className="h-6 w-6" />;
      case 'professional':
        return <Star className="h-6 w-6" />;
      case 'enterprise':
        return <Crown className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const getPackageColor = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case 'starter pack':
        return 'from-blue-500 to-cyan-500';
      case 'professional':
        return 'from-purple-500 to-pink-500';
      case 'enterprise':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Purchase AI Credits
          </DialogTitle>
          <p className="text-gray-600 text-center">
            Unlock powerful AI features with our credit packages
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {packages.map((pkg: CreditPackage) => (
            <Card 
              key={pkg.id} 
              className={`relative overflow-hidden border-2 transition-all duration-200 hover:shadow-lg ${
                pkg.is_popular 
                  ? 'border-purple-500 shadow-purple-100' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${getPackageColor(pkg.name)} flex items-center justify-center text-white mb-4`}>
                  {getPackageIcon(pkg.name)}
                </div>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold">
                  ${pkg.price_cad}
                  <span className="text-sm font-normal text-gray-500"> CAD</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {pkg.total_credits} Credits
                  </div>
                  {pkg.bonus_credits > 0 && (
                    <div className="text-sm text-gray-600">
                      {pkg.base_credits} base + {pkg.bonus_credits} bonus
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 text-center min-h-[40px]">
                  {pkg.description}
                </p>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Photo Analysis:</span>
                    <span>{Math.floor(pkg.total_credits / 5)} uses</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route Optimization:</span>
                    <span>{Math.floor(pkg.total_credits / 3)} uses</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Insights:</span>
                    <span>{Math.floor(pkg.total_credits / 2)} uses</span>
                  </div>
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={purchasing === pkg.id}
                  className={`w-full ${
                    pkg.is_popular 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                      : ''
                  }`}
                >
                  {purchasing === pkg.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Purchase ${pkg.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 How Credits Work</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Credits never expire and roll over month to month</li>
            <li>• Premium AI features require credits for enhanced capabilities</li>
            <li>• Free tier includes 5 basic support messages daily</li>
            <li>• Credit users get 4x higher daily limits and priority support</li>
            <li>• All prices include our 200%+ profit margin for sustainability</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditPurchaseDialog;
