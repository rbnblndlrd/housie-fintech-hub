
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
    <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/50 mb-8 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Statut
              </label>
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="bg-white rounded-xl border-gray-100/50 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.15)] transition-all duration-200">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] border border-gray-100/50">
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
                <SelectTrigger className="bg-white rounded-xl border-gray-100/50 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.15)] transition-all duration-200">
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] border border-gray-100/50">
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
