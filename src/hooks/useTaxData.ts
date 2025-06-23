
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuarterlyData {
  quarter: string;
  gross: number;
  net: number;
  transactions: number;
  expenses: number;
}

interface TaxDocument {
  name: string;
  description: string;
  action: string;
  generated_at?: string;
}

interface TaxData {
  totalEarnings: number;
  businessExpenses: number;
  netIncome: number;
  estimatedTax: number;
  quarterlyData: QuarterlyData[];
  totalTransactions: number;
  complianceRequired: boolean;
  documents: TaxDocument[];
  recentDocuments: { name: string; date: string }[];
}

export const useTaxData = (userId: string | undefined) => {
  const [taxData, setTaxData] = useState<TaxData>({
    totalEarnings: 0,
    businessExpenses: 0,
    netIncome: 0,
    estimatedTax: 0,
    quarterlyData: [],
    totalTransactions: 0,
    complianceRequired: false,
    documents: [],
    recentDocuments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTaxData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading tax data for user:', userId);

      // Get provider profile
      const { data: providerProfile, error: profileError } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      if (!providerProfile) throw new Error('Provider profile not found');

      // Get all completed bookings for tax year
      const currentYear = new Date().getFullYear();
      const yearStart = new Date(currentYear, 0, 1);
      const yearEnd = new Date(currentYear, 11, 31);

      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('provider_id', providerProfile.id)
        .eq('payment_status', 'succeeded')
        .gte('created_at', yearStart.toISOString())
        .lte('created_at', yearEnd.toISOString());

      if (bookingsError) throw bookingsError;

      const allBookings = bookings || [];
      
      // Calculate totals
      const totalEarnings = allBookings.reduce((sum, booking) => 
        sum + (Number(booking.total_amount) || 0), 0
      );

      // Mock business expenses (in reality would come from expense tracking)
      const businessExpenses = totalEarnings * 0.15; // 15% average business expense rate
      const netIncome = totalEarnings - businessExpenses;
      const estimatedTax = netIncome * 0.15; // Simplified tax rate

      // Calculate quarterly data
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const quarterlyData: QuarterlyData[] = [];

      for (let i = 0; i < 4; i++) {
        const quarterStart = new Date(currentYear, i * 3, 1);
        const quarterEnd = new Date(currentYear, (i + 1) * 3, 0);
        
        const quarterBookings = allBookings.filter(booking => {
          const bookingDate = new Date(booking.created_at);
          return bookingDate >= quarterStart && bookingDate <= quarterEnd;
        });

        const gross = quarterBookings.reduce((sum, booking) => 
          sum + (Number(booking.total_amount) || 0), 0
        );
        const expenses = gross * 0.15;
        const net = gross - expenses;

        quarterlyData.push({
          quarter: `${quarters[i]} ${currentYear}`,
          gross,
          net,
          transactions: quarterBookings.length,
          expenses,
        });
      }

      // Check compliance requirements
      const totalTransactions = allBookings.length;
      const complianceRequired = totalEarnings >= 2600 || totalTransactions >= 30;

      // Tax documents
      const documents: TaxDocument[] = [
        {
          name: "T4A Tax Slip",
          description: "Official CRA tax document",
          action: "Generate"
        },
        {
          name: "Annual Tax Summary",
          description: "Complete income and expense report",
          action: "Generate"
        },
        {
          name: "Quarterly Summary",
          description: `Q4 ${currentYear - 1} earnings breakdown`,
          action: "Generate"
        }
      ];

      const recentDocuments = [
        {
          name: `T4A - ${currentYear}`,
          date: new Date().toISOString().split('T')[0]
        }
      ];

      setTaxData({
        totalEarnings,
        businessExpenses,
        netIncome,
        estimatedTax,
        quarterlyData,
        totalTransactions,
        complianceRequired,
        documents,
        recentDocuments,
      });

      console.log('✅ Tax data loaded successfully');
    } catch (error: any) {
      console.error('❌ Failed to load tax data:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load tax data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxData();
  }, [userId]);

  return {
    taxData,
    loading,
    error,
    refreshTaxData: loadTaxData
  };
};
