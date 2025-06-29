
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, MapPin, DollarSign, Shield } from 'lucide-react';
import SubcategoryFilter from './filters/SubcategoryFilter';

const serviceCategories = [
  { id: 'all', name: 'Category' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'wellness', name: 'Wellness' },
  { id: 'care_pets', name: 'Pet Care' },
  { id: 'lawn_snow', name: 'Lawn & Snow' },
  { id: 'construction', name: 'Construction' }
];

const locations = [
  { id: 'montreal', name: 'Montreal' },
  { id: 'toronto', name: 'Toronto' },
  { id: 'vancouver', name: 'Vancouver' }
];

const timeSlots = [
  'Any time',
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
];

const priceRanges = [
  { id: 'all', name: 'Price Range' },
  { id: '20-40', name: '$20-40/hour' },
  { id: '40-60', name: '$40-60/hour' },
  { id: '60-100', name: '$60-100/hour' },
  { id: '100+', name: '$100+/hour' }
];

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
  selectedCategory,
  selectedSubcategory,
  selectedLocation,
  selectedTime,
  verifiedOnly,
  onCategoryChange,
  onSubcategoryChange,
  onLocationChange,
  onTimeChange,
  onPriceRangeChange,
  onVerifiedToggle
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px] h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs">🏷️</span>
            </div>
            <SelectValue placeholder="Category" />
          </div>
        </SelectTrigger>
        <SelectContent className="fintech-card border-4 border-black shadow-xl">
          {serviceCategories.map(category => (
            <SelectItem key={category.id} value={category.id} className="rounded-lg hover:bg-gray-100">
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Subcategory Filter */}
      <SubcategoryFilter
        category={selectedCategory}
        value={selectedSubcategory}
        onChange={onSubcategoryChange}
        className="w-[220px] h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      />

      {/* Location Filter */}
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[180px] h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <SelectValue placeholder="Montreal" />
          </div>
        </SelectTrigger>
        <SelectContent className="fintech-card border-4 border-black shadow-xl">
          {locations.map(location => (
            <SelectItem key={location.id} value={location.id} className="rounded-lg hover:bg-gray-100">
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Time Filter */}
      <Select value={selectedTime} onValueChange={onTimeChange}>
        <SelectTrigger className="w-[150px] h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <SelectValue placeholder="Any time" />
          </div>
        </SelectTrigger>
        <SelectContent className="fintech-card border-4 border-black shadow-xl">
          {timeSlots.map(time => (
            <SelectItem key={time} value={time} className="rounded-lg hover:bg-gray-100">
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Price Range Filter */}
      <Select onValueChange={(value) => {
        if (value === '20-40') onPriceRangeChange([20, 40]);
        else if (value === '40-60') onPriceRangeChange([40, 60]);
        else if (value === '60-100') onPriceRangeChange([60, 100]);
        else onPriceRangeChange([10, 200]);
      }}>
        <SelectTrigger className="w-[160px] h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <SelectValue placeholder="Price Range" />
          </div>
        </SelectTrigger>
        <SelectContent className="fintech-card border-4 border-black shadow-xl">
          {priceRanges.map(range => (
            <SelectItem key={range.id} value={range.id} className="rounded-lg hover:bg-gray-100">
              {range.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Verified Only Toggle */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
        <Shield className="w-4 h-4 text-blue-600" />
        <Label htmlFor="verified-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">
          Verified Only
        </Label>
        <Switch
          id="verified-toggle"
          checked={verifiedOnly}
          onCheckedChange={onVerifiedToggle}
        />
      </div>
    </div>
  );
};

export default ModernServiceFilters;
