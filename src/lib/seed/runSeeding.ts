/**
 * HOUSIE Seeding Runner
 * 
 * Utility script to run fallback service seeding manually or programmatically
 */

import { seedFallbackServices } from './fallbackServices';

/**
 * Run all seeding operations
 */
export const runAllSeeding = async (): Promise<void> => {
  console.log('🌱 Starting HOUSIE seeding operations...\n');
  
  try {
    await seedFallbackServices();
    console.log('\n✅ All seeding operations completed successfully!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  }
};

// Export individual functions for selective use
export { seedFallbackServices, findMissingServices, createFallbackServices, getServiceStats } from './fallbackServices';

/**
 * Browser console helper - allows running seeding from dev tools
 */
if (typeof window !== 'undefined') {
  (window as any).housieSeeding = {
    runAll: runAllSeeding,
    seedFallbackServices,
    createFallbackServices: () => import('./fallbackServices').then(m => m.createFallbackServices()),
    getStats: () => import('./fallbackServices').then(m => m.getServiceStats())
  };
  
  console.log('🔧 HOUSIE seeding tools available at window.housieSeeding');
}