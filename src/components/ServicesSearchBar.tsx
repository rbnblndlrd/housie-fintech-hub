
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Filter, DollarSign } from 'lucide-react';
import SubcategoryFilter from './filters/SubcategoryFilter';

const serviceCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'wellness', name: 'Wellness' },
  { id: 'care_pets', name: 'Pet Care' },
  { id: 'lawn_snow', name: 'Lawn & Snow' },
  { id: 'construction', name: 'Construction' }
];

const locations = [
  { id: 'montreal', name: 'Montreal, QC' },
  { id: 'laval', name: 'Laval, QC' },
  { id: 'longueuil', name: 'Longueuil, QC' },
  { id: 'quebec-city', name: 'Quebec City, QC' },
  { id: 'gatineau', name: 'Gatineau, QC' },
  { id: 'sherbrooke', name: 'Sherbrooke, QC' }
];

interface ServicesSearchBarProps {
  searchTerm: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedLocation: string;
  priceRange: [number, number];
  distance: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onDistanceChange: (value: number) => void;
  onSearch: () => void;
}

const ServicesSearchBar: React.FC<ServicesSearchBarProps> = ({
  searchTerm,
  selectedCategory,
  selectedSubcategory,
  selectedLocation,
  priceRange,
  distance,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange,
  onLocationChange,
  onPriceRangeChange,
  onDistanceChange,
  onSearch
}) => {
  return (
    <div className="fintech-card p-6 mb-6">
      {/* Main Search Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search services, providers, keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        
        {/* Category */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-12">
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
        
        {/* Subcategory */}
        <SubcategoryFilter
          category={selectedCategory}
          value={selectedSubcategory}
          onChange={onSubcategoryChange}
          className="h-12"
        />
        
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="h-12 pl-10">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
        {/* Price Range */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">
              Price: ${priceRange[0]} - ${priceRange[1]}/hr
            </label>
          </div>
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={200}
            min={10}
            step={5}
            className="w-full"
          />
        </div>

        {/* Distance */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Distance: {distance}km
          </label>
          <Slider
            value={[distance]}
            onValueChange={(value) => onDistanceChange(value[0])}
            max={50}
            min={5}
            step={5}
            className="w-full"
          />
        </div>

        {/* Search Button */}
        <div className="lg:col-span-2">
          <Button 
            onClick={onSearch}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
          >
            <Filter className="h-4 w-4 mr-2" />
            Find Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicesSearchBar;
