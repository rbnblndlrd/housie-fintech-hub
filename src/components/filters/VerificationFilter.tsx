
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface VerificationFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const VerificationFilter: React.FC<VerificationFilterProps> = ({
  value,
  onChange,
  placeholder = "Niveau de vérification",
  className = ""
}) => {
  const verificationOptions = [
    { value: 'all', label: 'Tous les niveaux', description: '' },
    { value: 'basic', label: 'Basique', description: 'Vérification de base' },
    { value: 'background_check', label: 'Vérification d\'antécédents', description: 'Vérification approfondie' },
    { value: 'professional_license', label: 'License professionnelle', description: 'CCQ/RBQ vérifié' }
  ];

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'professional_license': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'background_check': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'basic': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-12 rounded-2xl border-gray-200 ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="fintech-dropdown">
        {verificationOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <span>{option.label}</span>
              {option.value !== 'all' && (
                <Badge variant="outline" className={getBadgeColor(option.value)}>
                  {option.value === 'professional_license' ? 'CCQ/RBQ' : 
                   option.value === 'background_check' ? 'BC' : 'B'}
                </Badge>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VerificationFilter;
