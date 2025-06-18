
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FeeCalculatorProps {
  baseAmount: number;
  className?: string;
}

const FeeCalculator: React.FC<FeeCalculatorProps> = ({ baseAmount, className = "" }) => {
  const houseFee = baseAmount * 0.06;
  const totalAmount = baseAmount + houseFee;

  return (
    <Card className={`fintech-card ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Calcul des frais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Service de base</span>
          <span className="font-medium">{baseAmount.toFixed(2)}$ CAD</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Frais HOUSIE (6%)</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Les frais HOUSIE couvrent la plateforme, le support client, 
                    la protection des paiements et les services administratifs.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="font-medium text-blue-600">{houseFee.toFixed(2)}$ CAD</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total à payer</span>
            <span className="text-xl font-bold text-purple-600">{totalAmount.toFixed(2)}$ CAD</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>Paiement au prestataire:</span>
              <span className="font-medium text-green-600">{baseAmount.toFixed(2)}$ CAD</span>
            </div>
            <div className="flex justify-between">
              <span>Commission HOUSIE:</span>
              <span className="font-medium text-blue-600">{houseFee.toFixed(2)}$ CAD</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeCalculator;
