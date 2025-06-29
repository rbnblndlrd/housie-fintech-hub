
import React from 'react';
import { UserStats } from '@/types/adminTesting';

interface UserStatsDisplayProps {
  userStats: UserStats;
}

const UserStatsDisplay: React.FC<UserStatsDisplayProps> = ({ userStats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{userStats.communityRatingPoints}</div>
        <div className="text-sm text-gray-600">Community Points</div>
      </div>
      <div className="text-center p-3 bg-purple-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">{userStats.shopPoints}</div>
        <div className="text-sm text-gray-600">Shop Points</div>
      </div>
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{userStats.totalReviews}</div>
        <div className="text-sm text-gray-600">Reviews</div>
      </div>
      <div className="text-center p-3 bg-yellow-50 rounded-lg">
        <div className="text-2xl font-bold text-yellow-600">
          {userStats.qualityCommendations + userStats.reliabilityCommendations + userStats.courtesyCommendations}
        </div>
        <div className="text-sm text-gray-600">Commendations</div>
      </div>
    </div>
  );
};

export default UserStatsDisplay;
