
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import CategoryFilter from '@/components/filters/CategoryFilter';
import SubcategoryFilter from '@/components/filters/SubcategoryFilter';
import { Search, MapPin, DollarSign, Shield, Star, Filter, RotateCcw } from 'lucide-react';

interface ModernServiceFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedLocation: string;
  selectedTime: string;
  priceRange: [number, number];
  verifiedOnly: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onVerifiedToggle: (value: boolean) => void;
}

const ModernServiceFilters: React.FC<ModernServiceFiltersProps> = ({
  searchTerm,
  selectedCategory,
  selectedSubcategory,
  selectedLocation,
  selectedTime,
  priceRange,
  verifiedOnly,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange,
  onLocationChange,
  onTimeChange,
  onPriceRangeChange,
  onVerifiedToggle,
}) => {
  const resetFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onSubcategoryChange('all');
    onLocationChange('all');
    onTimeChange('Any time');
    onPriceRangeChange([10, 200]);
    onVerifiedToggle(false);
  };

  const activeFiltersCount = [
    searchTerm !== '',
    selectedCategory !== 'all',
    selectedSubcategory !== 'all',
    selectedLocation !== 'all',
    selectedTime !== 'Any time',
    priceRange[0] !== 10 || priceRange[1] !== 200,
    verifiedOnly
  ].filter(Boolean).length;

  return (
    <Card className="fintech-card mb-6">
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search services, providers, or locations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-lg fintech-input"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Category
            </label>
            <CategoryFilter
              value={selectedCategory}
              onChange={onCategoryChange}
              className="fintech-input"
            />
          </div>

          {/* Subcategory Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Subcategory
            </label>
            <SubcategoryFilter
              category={selectedCategory}
              value={selectedSubcategory}
              onChange={onSubcategoryChange}
              className="fintech-input"
            />
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full p-3 border-2 border-black rounded-md fintech-input"
            >
              <option value="all">All Locations</option>
              <option value="montreal">Montreal</option>
              <option value="laval">Laval</option>
              <option value="longueuil">Longueuil</option>
              <option value="gatineau">Gatineau</option>
              <option value="sherbrooke">Sherbrooke</option>
              <option value="saguenay">Saguenay</option>
              <option value="quebec">Quebec City</option>
              <option value="trois-rivieres">Trois-Rivières</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Availability</label>
            <select
              value={selectedTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full p-3 border-2 border-black rounded-md fintech-input"
            >
              <option value="Any time">Any time</option>
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="This week">This week</option>
              <option value="Next week">Next week</option>
              <option value="This month">This month</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="text-sm font-medium flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4" />
            Price Range: ${priceRange[0]} - ${priceRange[1]} CAD/hour
          </label>
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={500}
            min={10}
            step={5}
            className="w-full"
          />
        </div>

        {/* Verification Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <label className="text-sm font-medium">Verified Providers Only</label>
              <p className="text-xs text-gray-500">Show only background-checked providers</p>
            </div>
          </div>
          <Switch
            checked={verifiedOnly}
            onCheckedChange={onVerifiedToggle}
          />
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </Badge>
            )}
          </div>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={resetFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernServiceFilters;
