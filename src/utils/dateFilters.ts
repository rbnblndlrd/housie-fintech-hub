
import { DateRange } from '@/types/filters';

export const getDateRangePresets = (): Record<string, DateRange> => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return {
    all: { from: null, to: null },
    today: { 
      from: today, 
      to: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) 
    },
    week: {
      from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      to: now
    },
    month: {
      from: new Date(now.getFullYear(), now.getMonth(), 1),
      to: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    },
    '3months': {
      from: new Date(now.getFullYear(), now.getMonth() - 3, 1),
      to: now
    },
    year: {
      from: new Date(now.getFullYear(), 0, 1),
      to: new Date(now.getFullYear(), 11, 31)
    }
  };
};

export const isDateInRange = (date: string | Date, range: DateRange): boolean => {
  if (!range.from && !range.to) return true;
  
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  
  if (range.from && checkDate < range.from) return false;
  if (range.to && checkDate > range.to) return false;
  
  return true;
};

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
