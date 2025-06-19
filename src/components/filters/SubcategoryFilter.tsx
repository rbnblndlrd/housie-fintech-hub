
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ServiceSubcategory } from '@/types/filters';
import { fetchServiceSubcategories } from '@/services/filterService';

interface SubcategoryFilterProps {
  category: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SubcategoryFilter: React.FC<SubcategoryFilterProps> = ({
  category,
  value,
  onChange,
  className = ""
}) => {
  const [subcategories, setSubcategories] = useState<ServiceSubcategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (category === 'all') {
        setSubcategories([]);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchServiceSubcategories(category);
        setSubcategories(data);
      } catch (error) {
        console.error('Error loading subcategories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubcategories();
  }, [category]);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (category === 'all' || subcategories.length === 0) {
    return null;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-12 rounded-2xl border-gray-200 ${className}`}>
        <SelectValue placeholder="Sélectionner sous-catégorie" />
      </SelectTrigger>
      <SelectContent className="fintech-dropdown">
        <SelectItem value="all">Toutes les sous-catégories</SelectItem>
        {subcategories.map((subcategory) => (
          <SelectItem key={subcategory.id} value={subcategory.subcategory}>
            <div className="flex items-center justify-between w-full">
              <span className="flex-1">{subcategory.subcategory.replace(/_/g, ' ')}</span>
              <div className="flex gap-1 ml-2">
                <Badge variant="outline" className={getRiskBadgeColor(subcategory.risk_category)}>
                  {subcategory.risk_category}
                </Badge>
                {subcategory.background_check_required && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                    BC
                  </Badge>
                )}
                {subcategory.ccq_rbq_required && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    CCQ/RBQ
                  </Badge>
                )}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubcategoryFilter;
