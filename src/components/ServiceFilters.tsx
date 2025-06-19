
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, Filter } from 'lucide-react';
import SubcategoryFilter from './filters/SubcategoryFilter';

const serviceCategories = [
  { id: 'all', name: 'All Categories', count: 'All' },
  { id: 'cleaning', name: 'Cleaning', count: '15+' },
  { id: 'wellness', name: 'Wellness', count: '12+' },
  { id: 'care_pets', name: 'Pet Care', count: '8+' },
  { id: 'lawn_snow', name: 'Lawn & Snow', count: '10+' },
  { id: 'lawn_care', name: 'Lawn Care', count: '10+' }, // Add both variations
  { id: 'construction', name: 'Construction', count: '20+' }
];

interface ServiceFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedSubcategory?: string;
  selectedLocation: string;
  priceRange: [number, number];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange?: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchTerm,
  selectedCategory,
  selectedSubcategory = 'all',
  selectedLocation,
  priceRange,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange,
  onLocationChange,
  onPriceRangeChange
}) => {
  return (
    <div className="fintech-card p-6 mb-8">
      <div className="grid md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <SubcategoryFilter
          category={selectedCategory}
          value={selectedSubcategory}
          onChange={onSubcategoryChange || (() => {})}
        />
        
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="montreal">Montreal, QC</SelectItem>
            <SelectItem value="toronto">Toronto, ON</SelectItem>
            <SelectItem value="vancouver">Vancouver, BC</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={200}
            min={10}
            step={5}
            className="w-full"
          />
        </div>
        
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default ServiceFilters;
