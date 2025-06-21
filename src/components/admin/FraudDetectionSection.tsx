
import React from 'react';
import { useFraudData } from '@/hooks/useFraudData';
import FraudDetectionLoading from './fraud/FraudDetectionLoading';
import FraudDetectionContent from './fraud/FraudDetectionContent';

const FraudDetectionSection = () => {
  const {
    fraudLogs,
    reviewQueue,
    userBlocks,
    highRiskUsers,
    realtimeAlerts,
    stats,
    loading,
    loadFraudData,
    handleUnblockUser
  } = useFraudData();

  if (loading) {
    return <FraudDetectionLoading />;
  }

  return (
    <FraudDetectionContent
      fraudLogs={fraudLogs}
      reviewQueue={reviewQueue}
      userBlocks={userBlocks}
      highRiskUsers={highRiskUsers}
      realtimeAlerts={realtimeAlerts}
      stats={stats}
      onUpdate={loadFraudData}
      onUnblockUser={handleUnblockUser}
    />
  );
};

export default FraudDetectionSection;
