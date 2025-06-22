
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  value,
  onChange,
  placeholder = "Rechercher...",
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchFilter;
