
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';

interface UserTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

const UserTableFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onRefresh,
  loading
}: UserTableFiltersProps) => {
  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        onClick={onRefresh}
        disabled={loading}
        className="rounded-xl border-gray-200"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Actualiser
      </Button>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-80 rounded-xl border-gray-200"
        />
      </div>
      <select 
        value={filterStatus} 
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-3 py-2 border border-gray-200 rounded-xl bg-white"
      >
        <option value="all">Tous</option>
        <option value="providers">Prestataires</option>
        <option value="customers">Clients</option>
      </select>
    </div>
  );
};

export default UserTableFilters;
