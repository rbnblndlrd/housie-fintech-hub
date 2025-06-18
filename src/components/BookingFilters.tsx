
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

interface BookingFiltersProps {
  statusFilter: string;
  dateFilter: string;
  onStatusChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  statusFilter,
  dateFilter,
  onStatusChange,
  onDateChange
}) => {
  return (
    <Card className="fintech-card mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="flex flex-wrap gap-6 flex-1">
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Statut
              </label>
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="fintech-input">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent className="fintech-dropdown">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En Attente</SelectItem>
                  <SelectItem value="confirmed">Confirmées</SelectItem>
                  <SelectItem value="in_progress">En Cours</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Période
              </label>
              <Select value={dateFilter} onValueChange={onDateChange}>
                <SelectTrigger className="fintech-input">
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent className="fintech-dropdown">
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingFilters;
