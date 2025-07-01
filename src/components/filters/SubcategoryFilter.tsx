
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SubcategoryData {
  id: string;
  category: string;
  subcategory: string;
  subcategory_id: string;
  icon: string;
  background_check_required: boolean;
  professional_license_required: boolean;
  professional_license_type: string | null;
  ccq_rbq_required: boolean;
  risk_category: string;
  description: string;
}

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
  const [subcategories, setSubcategories] = useState<SubcategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (category === 'all') {
        setSubcategories([]);
        onChange('all');
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('service_subcategories')
          .select('*')
          .eq('category', category)
          .order('subcategory', { ascending: true });

        if (error) {
          console.error('Error fetching subcategories:', error);
          setSubcategories([]);
        } else {
          setSubcategories(data || []);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategories();
  }, [category, onChange]);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading || category === 'all'}>
      <SelectTrigger className={`${className} ${category === 'all' ? 'opacity-50' : ''} bg-white`}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs">🏷️</span>
          </div>
          <SelectValue placeholder={
            category === 'all' ? "Select category first" : 
            isLoading ? "Loading..." : 
            "All Subcategories"
          } />
        </div>
      </SelectTrigger>
      <SelectContent className="fintech-card border-4 border-black shadow-xl bg-white z-50 max-h-96 overflow-y-auto">
        <SelectItem value="all" className="hover:bg-gray-100">All Subcategories</SelectItem>
        {subcategories.map((subcategory) => (
          <SelectItem key={subcategory.id} value={subcategory.subcategory_id} className="hover:bg-gray-100 p-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-lg">{subcategory.icon}</span>
                <span className="flex-1">{subcategory.subcategory}</span>
              </div>
              <div className="flex gap-1 ml-2">
                <Badge variant="outline" className={`text-xs ${getRiskBadgeColor(subcategory.risk_category)}`}>
                  {subcategory.risk_category}
                </Badge>
                {subcategory.background_check_required && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    BC
                  </Badge>
                )}
                {subcategory.professional_license_required && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {subcategory.professional_license_type?.toUpperCase()}
                  </Badge>
                )}
                {subcategory.ccq_rbq_required && (
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
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
