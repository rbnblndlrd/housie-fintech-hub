
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
  { id: 'construction', name: 'Construction', count: '20+' }
];

interface ServiceFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedSubcategory?: string;
  selectedLocation: string;
  priceRange: [number, number];
  distance?: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange?: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onDistanceChange?: (value: number) => void;
  onSearch?: () => void;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchTerm,
  selectedCategory,
  selectedSubcategory = 'all',
  selectedLocation,
  priceRange,
  distance = 25,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange,
  onLocationChange,
  onPriceRangeChange,
  onDistanceChange,
  onSearch
}) => {
  return (
    <div className="fintech-card p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        
        <div>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <SubcategoryFilter
            category={selectedCategory}
            value={selectedSubcategory}
            onChange={onSubcategoryChange || (() => {})}
          />
        </div>
        
        <div>
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
        </div>
        
        <div>
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={onSearch}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
        
        {onDistanceChange && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Distance: {distance} km
            </label>
            <Slider
              value={[distance]}
              onValueChange={(value) => onDistanceChange(value[0])}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceFilters;
