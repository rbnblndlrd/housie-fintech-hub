
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Award } from 'lucide-react';
import { serviceCategories, getSubcategoryById } from '@/data/serviceCategories';

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
  const [subcategories, setSubcategories] = useState<any[]>([]);

  useEffect(() => {
    if (category === 'all') {
      setSubcategories([]);
      return;
    }

    const categoryData = serviceCategories.find(cat => cat.id === category);
    setSubcategories(categoryData?.subcategories || []);
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
        <SelectValue placeholder="Toutes les sous-catégories" />
      </SelectTrigger>
      <SelectContent className="fintech-dropdown">
        <SelectItem value="all">Toutes les sous-catégories</SelectItem>
        {subcategories.map((subcategory) => (
          <SelectItem key={subcategory.id} value={subcategory.id}>
            <div className="flex items-center justify-between w-full">
              <span className="flex-1">{subcategory.name}</span>
              <div className="flex gap-1 ml-2">
                <Badge variant="outline" className={getRiskBadgeColor(subcategory.riskCategory)}>
                  {subcategory.riskCategory}
                </Badge>
                {subcategory.backgroundCheckRequired && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                    <Shield className="h-3 w-3 mr-1" />
                    BC
                  </Badge>
                )}
                {subcategory.ccqRbqRequired && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    <Award className="h-3 w-3 mr-1" />
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
