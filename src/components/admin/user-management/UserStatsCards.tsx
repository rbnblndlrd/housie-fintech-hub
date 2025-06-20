
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, UserX, Calendar } from 'lucide-react';

interface UserStatsCardsProps {
  totalUsers: number;
  verifiedProviders: number;
  pendingProviders: number;
  newUsersLast30Days: number;
}

const UserStatsCards = ({
  totalUsers,
  verifiedProviders,
  pendingProviders,
  newUsersLast30Days
}: UserStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="fintech-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Utilisateurs Totaux</p>
              <p className="text-3xl font-black text-gray-900">{totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="fintech-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Prestataires Vérifiés</p>
              <p className="text-3xl font-black text-gray-900">{verifiedProviders.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="fintech-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">En Attente d'Approbation</p>
              <p className="text-3xl font-black text-gray-900">{pendingProviders.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <UserX className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="fintech-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Nouveaux (30j)</p>
              <p className="text-3xl font-black text-gray-900">{newUsersLast30Days.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsCards;
