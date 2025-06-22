
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from '@/types/filters';
import { getDateRangePresets, formatDateForDisplay } from '@/utils/dateFilters';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (from: Date | null, to: Date | null) => void;
  presets?: boolean;
  className?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  presets = true,
  className = ""
}) => {
  const datePresets = getDateRangePresets();

  const handlePresetClick = (preset: string) => {
    const range = datePresets[preset];
    onChange(range.from, range.to);
  };

  const getDisplayText = () => {
    if (!value.from && !value.to) return "Sélectionner la période";
    if (value.from && value.to) {
      return `${formatDateForDisplay(value.from)} - ${formatDateForDisplay(value.to)}`;
    }
    if (value.from) return `À partir du ${formatDateForDisplay(value.from)}`;
    if (value.to) return `Jusqu'au ${formatDateForDisplay(value.to)}`;
    return "Sélectionner la période";
  };

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-12 rounded-2xl border-gray-200",
              (!value.from && !value.to) && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {presets && (
              <div className="border-r p-3 space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">Raccourcis</div>
                {Object.entries(datePresets).map(([key, range]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePresetClick(key)}
                    className="w-full justify-start text-left"
                  >
                    {key === 'all' ? 'Toutes les dates' :
                     key === 'today' ? 'Aujourd\'hui' :
                     key === 'week' ? 'Cette semaine' :
                     key === 'month' ? 'Ce mois' :
                     key === '3months' ? '3 derniers mois' :
                     key === 'year' ? 'Cette année' : key}
                  </Button>
                ))}
              </div>
            )}
            <Calendar
              mode="range"
              selected={{
                from: value.from || undefined,
                to: value.to || undefined
              }}
              onSelect={(range) => {
                onChange(range?.from || null, range?.to || null);
              }}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeFilter;
