
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatusOption {
  value: string;
  label: string;
}

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: StatusOption[];
  placeholder?: string;
  className?: string;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  value,
  onChange,
  options,
  placeholder = "Sélectionner le statut",
  className = ""
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-12 rounded-2xl border-gray-200 clean-input ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="clean-select-content">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;

