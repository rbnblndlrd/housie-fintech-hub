// CBS Event Detectors - Logic for detecting Canon-verified events

import { CBSEventDetector, CBSEventCreate } from './types';

// Booking completion detector
const bookingCompletionDetector: CBSEventDetector = {
  table: 'bookings',
  event_types: ['UPDATE'],
  canonConfidence: 0.95,
  detector: (payload) => {
    const { new: newRecord, old: oldRecord } = payload;
    
    // Detect when a booking is completed
    if (oldRecord?.status !== 'completed' && newRecord?.status === 'completed') {
      return {
        event_type: 'booking_completed',
        user_id: newRecord.provider_id ? newRecord.provider_id : newRecord.customer_id,
        source_table: 'bookings',
        source_id: newRecord.id,
        verified: true,
        broadcast_scope: 'city',
        visible_to_public: true,
        canon_confidence: 0.95,
        metadata: {
          booking_id: newRecord.id,
          service_type: newRecord.category,
          customer_id: newRecord.customer_id,
          provider_id: newRecord.provider_id,
          amount: newRecord.total_amount,
          completed_at: newRecord.completed_at
        }
      };
    }
    return null;
  }
};

// Review submission detector
const reviewSubmissionDetector: CBSEventDetector = {
  table: 'reviews',
  event_types: ['INSERT'],
  canonConfidence: 0.9,
  detector: (payload) => {
    const { new: newRecord } = payload;
    
    if (newRecord && newRecord.verified_transaction) {
      const eventType = newRecord.rating >= 4.5 ? 'excellent_review_received' : 'review_received';
      
      return {
        event_type: eventType,
        user_id: newRecord.reviewer_id,
        source_table: 'reviews',
        source_id: newRecord.id,
        verified: true,
        broadcast_scope: newRecord.rating >= 4.5 ? 'city' : 'local',
        visible_to_public: true,
        canon_confidence: 0.9,
        metadata: {
          review_id: newRecord.id,
          rating: newRecord.rating,
          provider_id: newRecord.provider_id,
          booking_id: newRecord.booking_id,
          has_comment: !!newRecord.comment
        }
      };
    }
    return null;
  }
};

// Service connection establishment detector
const serviceConnectionDetector: CBSEventDetector = {
  table: 'service_connections',
  event_types: ['INSERT', 'UPDATE'],
  canonConfidence: 0.85,
  detector: (payload) => {
    const { new: newRecord, old: oldRecord } = payload;
    
    // Detect when messaging is unlocked (trust milestone)
    if (!oldRecord?.can_message && newRecord?.can_message) {
      return {
        event_type: 'trust_connection_established',
        user_id: newRecord.user_one_id,
        source_table: 'service_connections',
        source_id: newRecord.id,
        verified: true,
        broadcast_scope: 'local',
        visible_to_public: true,
        canon_confidence: 0.85,
        metadata: {
          connection_id: newRecord.id,
          user_one_id: newRecord.user_one_id,
          user_two_id: newRecord.user_two_id,
          connection_tier: newRecord.connection_tier,
          service_count: newRecord.service_connection_count
        }
      };
    }
    
    // Detect loyal return milestone
    if (newRecord?.service_connection_count >= 3 && 
        (!oldRecord || oldRecord.service_connection_count < 3)) {
      return {
        event_type: 'loyal_return_stamp',
        user_id: newRecord.user_one_id,
        source_table: 'service_connections',
        source_id: newRecord.id,
        verified: true,
        broadcast_scope: 'city',
        visible_to_public: true,
        canon_confidence: 0.9,
        metadata: {
          connection_id: newRecord.id,
          service_count: newRecord.service_connection_count,
          connection_tier: newRecord.connection_tier
        }
      };
    }
    
    return null;
  }
};

// Point transaction detector for achievements
const pointTransactionDetector: CBSEventDetector = {
  table: 'point_transactions',
  event_types: ['INSERT'],
  canonConfidence: 0.8,
  detector: (payload) => {
    const { new: newRecord } = payload;
    
    if (newRecord && newRecord.transaction_type === 'earned' && newRecord.points_amount >= 5) {
      const eventType = newRecord.points_amount >= 10 ? 'major_achievement_earned' : 'achievement_earned';
      
      return {
        event_type: eventType,
        user_id: newRecord.user_id,
        source_table: 'point_transactions',
        source_id: newRecord.id,
        verified: true,
        broadcast_scope: newRecord.points_amount >= 10 ? 'city' : 'local',
        visible_to_public: true,
        canon_confidence: 0.8,
        metadata: {
          points_earned: newRecord.points_amount,
          reason: newRecord.reason,
          transaction_type: newRecord.transaction_type
        }
      };
    }
    return null;
  }
};

// Provider profile milestone detector
const providerMilestoneDetector: CBSEventDetector = {
  table: 'provider_profiles',
  event_types: ['UPDATE'],
  canonConfidence: 0.92,
  detector: (payload) => {
    const { new: newRecord, old: oldRecord } = payload;
    
    // Detect verification milestone
    if (!oldRecord?.verified && newRecord?.verified) {
      return {
        event_type: 'provider_verified',
        user_id: newRecord.user_id,
        source_table: 'provider_profiles',
        source_id: newRecord.id,
        verified: true,
        broadcast_scope: 'city',
        visible_to_public: true,
        canon_confidence: 0.92,
        metadata: {
          verification_level: newRecord.verification_level,
          professional_license_verified: newRecord.professional_license_verified,
          background_check_verified: newRecord.background_check_verified
        }
      };
    }
    
    // Detect rating milestone (4.5+ average)
    if (newRecord?.average_rating >= 4.5 && 
        newRecord?.total_reviews >= 5 && 
        (!oldRecord || oldRecord.average_rating < 4.5)) {
      return {
        event_type: 'excellence_rating_achieved',
        user_id: newRecord.user_id,
        source_table: 'provider_profiles',
        source_id: newRecord.id,
        verified: true,
        broadcast_scope: 'city',
        visible_to_public: true,
        canon_confidence: 0.95,
        metadata: {
          average_rating: newRecord.average_rating,
          total_reviews: newRecord.total_reviews,
          total_bookings: newRecord.total_bookings
        }
      };
    }
    
    return null;
  }
};

export const CBS_DETECTORS: CBSEventDetector[] = [
  bookingCompletionDetector,
  reviewSubmissionDetector,
  serviceConnectionDetector,
  pointTransactionDetector,
  providerMilestoneDetector
];

export const CBS_EVENT_TYPES = {
  BOOKING_COMPLETED: 'booking_completed',
  REVIEW_RECEIVED: 'review_received',
  EXCELLENT_REVIEW_RECEIVED: 'excellent_review_received',
  TRUST_CONNECTION_ESTABLISHED: 'trust_connection_established',
  LOYAL_RETURN_STAMP: 'loyal_return_stamp',
  ACHIEVEMENT_EARNED: 'achievement_earned',
  MAJOR_ACHIEVEMENT_EARNED: 'major_achievement_earned',
  PROVIDER_VERIFIED: 'provider_verified',
  EXCELLENCE_RATING_ACHIEVED: 'excellence_rating_achieved'
} as const;