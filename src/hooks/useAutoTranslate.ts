
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslateService } from '@/services/translateService';

export const useAutoTranslate = (text: string | null | undefined): {
  translatedText: string;
  isLoading: boolean;
  error: string | null;
} => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text || text.trim() === '') {
      setTranslatedText('');
      return;
    }

    // If language is English, return original text
    if (language === 'en') {
      setTranslatedText(text);
      return;
    }

    // If language is French, translate
    if (language === 'fr') {
      setIsLoading(true);
      setError(null);
      
      TranslateService.translateText(text, 'fr', 'en')
        .then(translated => {
          setTranslatedText(translated);
          setError(null);
        })
        .catch(err => {
          console.error('Translation error:', err);
          setError('Translation failed');
          setTranslatedText(text); // Fallback to original
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [text, language]);

  return {
    translatedText,
    isLoading,
    error
  };
};
