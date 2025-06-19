
import { useEffect, useRef } from 'react';

// This hook is now disabled to prevent subscription conflicts
// All notification functionality has been consolidated into useNotifications
export const useEnhancedNotifications = () => {
  console.log('⚠️ useEnhancedNotifications is disabled - using consolidated useNotifications instead');
  
  // Return empty object to maintain compatibility
  return {};
};
