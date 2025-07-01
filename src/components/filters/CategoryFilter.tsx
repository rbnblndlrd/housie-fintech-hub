
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AutoTranslate from '@/components/AutoTranslate';

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const categories = [
  { id: 'all', name: 'All Categories', icon: '🔍' },
  { id: 'personal_wellness', name: 'Personal Wellness', icon: '💆' },
  { id: 'cleaning', name: 'Cleaning Services', icon: '🧹' },
  { id: 'exterior_grounds', name: 'Exterior & Grounds', icon: '🌿' },
  { id: 'pet_care', name: 'Pet Care Services', icon: '🐕' },
  { id: 'appliance_tech', name: 'Appliance & Tech Repair', icon: '🔧' },
  { id: 'event_services', name: 'Event Services', icon: '🎪' },
  { id: 'moving_services', name: 'Moving Services', icon: '🚚' }
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange, className = "" }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`${className} bg-white`}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs">
              {categories.find(cat => cat.id === value)?.icon || '🔍'}
            </span>
          </div>
          <SelectValue placeholder="All Categories" />
        </div>
      </SelectTrigger>
      <SelectContent className="fintech-card border-4 border-black shadow-xl bg-white z-50">
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id} className="hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">{category.icon}</span>
              <AutoTranslate>{category.name}</AutoTranslate>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
