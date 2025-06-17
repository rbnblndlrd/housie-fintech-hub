
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from 'lucide-react';

interface ServiceFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedLocation: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

const categories = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'cleaning', label: 'Nettoyage' },
  { value: 'lawn_care', label: 'Entretien paysager' },
  { value: 'construction', label: 'Construction' },
  { value: 'wellness', label: 'Bien-être' },
  { value: 'care_pets', label: 'Soins aux animaux' },
];

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchTerm,
  selectedCategory,
  selectedLocation,
  onSearchChange,
  onCategoryChange,
  onLocationChange
}) => {
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 shadow-lg mb-8 border dark:border-gray-700">
      <div className="grid md:grid-cols-4 gap-4">
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
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default ServiceFilters;
