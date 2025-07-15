import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useSeasonalData } from '@/hooks/useSeasonalData';

interface SeasonalBadgeProps {
  timestamp: string;
  className?: string;
}

export function SeasonalBadge({ timestamp, className }: SeasonalBadgeProps) {
  const { allSeasons, getSeasonThemeIcon } = useSeasonalData();
  
  // Find which season this timestamp belongs to
  const eventDate = new Date(timestamp);
  const season = allSeasons.find(season => {
    const seasonStart = new Date(season.start_date);
    const seasonEnd = new Date(season.end_date);
    return eventDate >= seasonStart && eventDate <= seasonEnd;
  });

  if (!season) return null;

  return (
    <Badge 
      variant="outline" 
      className={`text-xs ${className}`}
      title={`${season.name} (${season.theme})`}
    >
      {getSeasonThemeIcon(season.theme)}
    </Badge>
  );
}