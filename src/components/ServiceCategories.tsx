
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';

interface ServiceCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
}

const serviceCategories = [
  { 
    id: 'cleaning', 
    name: 'Cleaning', 
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: '🏠'
  },
  { 
    id: 'wellness', 
    name: 'Wellness', 
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: '💪'
  },
  { 
    id: 'care_pets', 
    name: 'Pet Care', 
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    icon: '🐕'
  },
  { 
    id: 'lawn_snow', 
    name: 'Lawn & Snow', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: '🌳'
  },
  { 
    id: 'construction', 
    name: 'Construction', 
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: '🔧'
  }
];

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ onCategorySelect }) => {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('category')
          .eq('active', true);

        if (!error && data) {
          const counts = data.reduce((acc, service) => {
            acc[service.category] = (acc[service.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          setCategoryCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []);

  return (
    <Card className="bg-white dark:bg-dark-secondary shadow-lg border dark:border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black dark:text-white text-lg">
          Service Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {serviceCategories.map(category => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            onClick={() => onCategorySelect(category.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{category.icon}</span>
              <Badge className={category.color}>
                {category.name}
              </Badge>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {categoryCounts[category.id] || 0}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ServiceCategories;
