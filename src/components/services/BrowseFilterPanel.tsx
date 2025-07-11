import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import CategoryFilter from '@/components/filters/CategoryFilter';
import SubcategoryFilter from '@/components/filters/SubcategoryFilter';
import AutoTranslate from '@/components/AutoTranslate';
import { Search, MapPin, DollarSign, Shield, Filter, RotateCcw, Star, Clock } from 'lucide-react';

interface BrowseFilterPanelProps {
  searchTerm: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedLocation: string;
  selectedTime: string;
  priceRange: [number, number];
  verifiedOnly: boolean;
  minCredScore: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onVerifiedToggle: (value: boolean) => void;
  onMinCredScoreChange: (value: number) => void;
  onTriggerAnnette?: (filterContext: string) => void;
}

const BrowseFilterPanel: React.FC<BrowseFilterPanelProps> = ({
  searchTerm,
  selectedCategory,
  selectedSubcategory,
  selectedLocation,
  selectedTime,
  priceRange,
  verifiedOnly,
  minCredScore,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange,
  onLocationChange,
  onTimeChange,
  onPriceRangeChange,
  onVerifiedToggle,
  onMinCredScoreChange,
  onTriggerAnnette,
}) => {
  const resetFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onSubcategoryChange('all');
    onLocationChange('all');
    onTimeChange('Any time');
    onPriceRangeChange([10, 200]);
    onVerifiedToggle(false);
    onMinCredScoreChange(0);
  };

  const activeFiltersCount = [
    searchTerm !== '',
    selectedCategory !== 'all',
    selectedSubcategory !== 'all',
    selectedLocation !== 'all',
    selectedTime !== 'Any time',
    priceRange[0] !== 10 || priceRange[1] !== 200,
    verifiedOnly,
    minCredScore > 0
  ].filter(Boolean).length;

  const handleFilterChange = (filterType: string) => {
    if (onTriggerAnnette) {
      const context = `Applied ${filterType} filter in ${selectedLocation !== 'all' ? selectedLocation : 'all locations'}`;
      onTriggerAnnette(context);
    }
  };

  return (
    <Card className="fintech-card mb-6">
      <CardContent className="p-6">
        {/* Smart Search Bar with AI suggestions */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Find your perfect service match..."
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (e.target.value.length > 3) {
                handleFilterChange('search');
              }
            }}
            className="pl-10 h-12 text-lg fintech-input"
          />
          {searchTerm.length > 3 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                AI Enhanced
              </Badge>
            </div>
          )}
        </div>

        {/* Enhanced Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <AutoTranslate>Category</AutoTranslate>
            </label>
            <CategoryFilter
              value={selectedCategory}
              onChange={(value) => {
                onCategoryChange(value);
                handleFilterChange('category');
              }}
              className="fintech-input"
            />
          </div>

          {/* Subcategory Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <AutoTranslate>Subcategory</AutoTranslate>
            </label>
            <SubcategoryFilter
              category={selectedCategory}
              value={selectedSubcategory}
              onChange={(value) => {
                onSubcategoryChange(value);
                handleFilterChange('subcategory');
              }}
              className="fintech-input"
            />
          </div>

          {/* Location Filter with GPS option */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <AutoTranslate>Location</AutoTranslate>
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                onLocationChange(e.target.value);
                handleFilterChange('location');
              }}
              className="w-full p-3 border-2 border-black rounded-md fintech-input bg-white"
            >
              <option value="all"><AutoTranslate>All Locations</AutoTranslate></option>
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

          {/* Availability Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <AutoTranslate>Availability</AutoTranslate>
            </label>
            <select
              value={selectedTime}
              onChange={(e) => {
                onTimeChange(e.target.value);
                handleFilterChange('availability');
              }}
              className="w-full p-3 border-2 border-black rounded-md fintech-input bg-white"
            >
              <option value="Any time"><AutoTranslate>Any time</AutoTranslate></option>
              <option value="Today"><AutoTranslate>Today</AutoTranslate></option>
              <option value="Tomorrow"><AutoTranslate>Tomorrow</AutoTranslate></option>
              <option value="This week"><AutoTranslate>This week</AutoTranslate></option>
              <option value="Next week"><AutoTranslate>Next week</AutoTranslate></option>
              <option value="This month"><AutoTranslate>This month</AutoTranslate></option>
            </select>
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="mb-6">
          <label className="text-sm font-medium flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4" />
            <AutoTranslate>Price Range</AutoTranslate>: ${priceRange[0]} - ${priceRange[1]} CAD/hour
          </label>
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              onPriceRangeChange(value as [number, number]);
              handleFilterChange('price');
            }}
            max={500}
            min={10}
            step={5}
            className="w-full"
          />
        </div>

        {/* Credibility Score Slider */}
        <div className="mb-6">
          <label className="text-sm font-medium flex items-center gap-2 mb-3">
            <Star className="h-4 w-4" />
            <AutoTranslate>Minimum Cred Score</AutoTranslate>: {minCredScore}/100
          </label>
          <Slider
            value={[minCredScore]}
            onValueChange={(value) => {
              onMinCredScoreChange(value[0]);
              handleFilterChange('cred score');
            }}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Any Score</span>
            <span>Elite Only</span>
          </div>
        </div>

        {/* Verification Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <label className="text-sm font-medium"><AutoTranslate>Verified Providers Only</AutoTranslate></label>
              <p className="text-xs text-gray-500"><AutoTranslate>Background-checked & certified</AutoTranslate></p>
            </div>
          </div>
          <Switch
            checked={verifiedOnly}
            onCheckedChange={(checked) => {
              onVerifiedToggle(checked);
              handleFilterChange('verification');
            }}
          />
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {activeFiltersCount} <AutoTranslate>{`${activeFiltersCount !== 1 ? 'filters' : 'filter'} active`}</AutoTranslate>
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
              <AutoTranslate>Reset Filters</AutoTranslate>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowseFilterPanel;