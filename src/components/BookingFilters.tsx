
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Calendar } from 'lucide-react';

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
    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Statut
              </label>
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="bg-white rounded-xl border-gray-200">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
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
                <SelectTrigger className="bg-white rounded-xl border-gray-200">
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent>
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
