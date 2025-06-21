
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
    error,
    loadFraudData,
    handleUnblockUser,
    forceRefresh
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
      error={error}
      onUpdate={loadFraudData}
      onUnblockUser={handleUnblockUser}
      onForceRefresh={forceRefresh}
    />
  );
};

export default FraudDetectionSection;
