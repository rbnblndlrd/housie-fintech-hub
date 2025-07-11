import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  Briefcase,
  Home,
  Wrench,
  Scissors,
  Car,
  PaintBucket,
  Truck,
  Heart
} from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const serviceCategories = [
  { id: 'cleaning', label: 'Residential Cleaning', icon: Home, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'lawn_care', label: 'Lawn & Garden Care', icon: PaintBucket, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'construction', label: 'Construction & Repairs', icon: Wrench, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'wellness', label: 'Personal Wellness', icon: Heart, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'care_pets', label: 'Pet Care Services', icon: Heart, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'automotive', label: 'Automotive Services', icon: Car, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'beauty', label: 'Beauty & Grooming', icon: Scissors, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'delivery', label: 'Delivery & Moving', icon: Truck, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' }
];

export const ProviderOnboardingStep2: React.FC<Props> = ({
  onNext,
  onBack
}) => {
  const { user } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing service drafts to preload selection
    const loadExistingServices = async () => {
      if (!user) return;
      
      const { data: drafts } = await supabase
        .from('service_drafts')
        .select('category')
        .eq('user_id', user.id);
      
      if (drafts && drafts.length > 0) {
        setSelectedCategories(drafts.map(d => d.category));
      }
    };

    loadExistingServices();
  }, [user]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else if (prev.length < 5) {
        return [...prev, categoryId];
      }
      return prev;
    });
  };

  const saveServices = async () => {
    if (!user || selectedCategories.length === 0) return;
    
    setLoading(true);
    try {
      // Delete existing drafts
      await supabase
        .from('service_drafts')
        .delete()
        .eq('user_id', user.id);

      // Insert new service drafts for selected categories
      const serviceDrafts = selectedCategories.map(category => ({
        user_id: user.id,
        title: `${category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')} Service`,
        category,
        description: 'Professional service, customizable to your needs.',
        status: 'draft' as const
      }));

      const { error } = await supabase
        .from('service_drafts')
        .insert(serviceDrafts);

      if (error) throw error;
      
      onNext();
    } catch (error) {
      console.error('Error saving services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Briefcase className="h-5 w-5" />
          Choose Your Services
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select 1-5 service categories you'd like to offer. You can always add more later.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const Icon = category.icon;
            
            return (
              <div
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? `${category.color} border-opacity-60` 
                    : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                  }
                  ${selectedCategories.length >= 5 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isSelected ? category.color.split(' ')[1] : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${isSelected ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                    {category.label}
                  </span>
                  {isSelected && (
                    <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedCategories.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Selected services:</p>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(categoryId => {
                const category = serviceCategories.find(c => c.id === categoryId);
                return (
                  <Badge key={categoryId} variant="secondary" className="bg-primary/20 text-primary">
                    {category?.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-muted/30 p-4 rounded-lg border border-muted-foreground/20">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Start with 1-2 services you're most confident about. 
            You can expand your offerings once you build your reputation!
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-muted-foreground/20"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={saveServices}
            disabled={selectedCategories.length === 0 || loading}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {loading ? 'Saving...' : 'Continue to Verification'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};