
import React from 'react';
import TransactionVerifiedReviews from './TransactionVerifiedReviews';

interface ProviderReviewSystemProps {
  providerId: string;
  providerUserId: string;
}

const ProviderReviewSystem: React.FC<ProviderReviewSystemProps> = ({
  providerId,
  providerUserId
}) => {
  return (
    <TransactionVerifiedReviews 
      providerId={providerId}
      providerUserId={providerUserId}
    />
  );
};

export default ProviderReviewSystem;
