
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-white hover:text-gray-300 hover:bg-gray-800 text-sm px-3 py-1 h-8"
    >
      {language === 'en' ? 'FR' : 'EN'}
    </Button>
  );
};

export default LanguageToggle;
