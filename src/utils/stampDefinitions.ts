// Stamp Definitions - Canon-enhanced stamp system with dynamic conditions
import { type UserContext } from './contextAwareEngine';

// Define JobData interface locally to avoid circular dependency
export interface JobData {
  id: string;
  userId: string;
  serviceType: string;
  completedAt: Date;
  distanceKm?: number;
  duration?: number;
  rating?: number;
  isTeamJob?: boolean;
  priority?: 'normal' | 'high';
  location?: string;
  clientId?: string;
  totalAmount?: number;
}

export interface StampDefinition {
  id: string;
  title: string;
  description: string;
  canonical: boolean; // true = Canon verified, false = Non-Canon intuition
  triggerCondition: (job: JobData, user: UserContext) => Promise<boolean> | boolean;
  icon: string;
  voiceLine: (user: UserContext, contextData?: Record<string, any>) => string;
  category: 'Performance' | 'Loyalty' | 'Crew' | 'Behavior' | 'Reputation';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  tags: string[];
}

/**
 * All available stamp definitions with Canon-aware conditions
 */
export const STAMP_DEFINITIONS: StampDefinition[] = [
  {
    id: 'road-warrior',
    title: 'Road Warrior',
    description: 'Completed a job more than 25km from home base.',
    canonical: true, // Distance is measurable = Canon
    icon: '🛣️',
    category: 'Performance',
    rarity: 'uncommon',
    tags: ['distance', 'travel', 'dedication'],
    triggerCondition: (job: JobData) => {
      return (job.distanceKm || 0) >= 25;
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      const distance = contextData?.distanceKm || '25+';
      const title = user.equippedTitle?.name;
      
      if (title?.includes('Road Warrior')) {
        return `Sweet mercy, you drove ${distance}km for that booking? Road Warrior calling to Road Warrior — that's Canon glory right there! 🛣️✅`;
      }
      
      if (user.prestigeRank === 0) {
        return `Whoa there, rookie! ${distance}km for your first major haul? That's Road Warrior potential brewing! 🚗💨`;
      }
      
      return `${distance}km round trip and you still delivered perfection? Stamp of glory: Road Warrior earned! 🛣️🔥`;
    }
  },

  {
    id: 'one-woman-army',
    title: 'One-Woman Army',
    description: 'Completed 3+ high-priority jobs solo in one day.',
    canonical: true, // Job completion data = Canon
    icon: '⚡',
    category: 'Performance',
    rarity: 'rare',
    tags: ['productivity', 'solo', 'high-priority'],
    triggerCondition: async (job: JobData, user: UserContext) => {
      // Check if today had 3+ high-priority jobs
      return user.totalBookingsToday >= 3 && job.priority === 'high' && !job.isTeamJob;
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      const count = user.totalBookingsToday;
      
      if (user.equippedTitle?.name.includes('Commander')) {
        return `Commander energy confirmed! ${count} high-priority missions completed solo. One-Woman Army status: EARNED! ⚡👑`;
      }
      
      return `${count} high-priority jobs solo in one day? You're not just working, you're conquering! One-Woman Army stamped! ⚡🔥`;
    }
  },

  {
    id: 'loyal-return',
    title: 'Loyal Return',
    description: 'Rebooked by a client within 14 days.',
    canonical: true, // Rebooking data = Canon
    icon: '🔄',
    category: 'Loyalty',
    rarity: 'common',
    tags: ['loyalty', 'rebooking', 'client-satisfaction'],
    triggerCondition: async (job: JobData) => {
      // Mock logic: 30% chance for demo purposes
      // In real implementation, check if client rebooked within 14 days
      return Math.random() > 0.7;
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      if (user.prestigeRank >= 5) {
        return `They called you back again? Of course they did! Loyal Return earned — that's veteran-level trust right there! 🔄✨`;
      }
      
      return `Look who's back for more of your magic! Client loyalty earned the hard way. Loyal Return stamped! 🔄💙`;
    }
  },

  {
    id: 'crew-commander',
    title: 'Crew Commander',
    description: 'Managed 2+ team jobs within 24 hours.',
    canonical: true, // Team job data = Canon
    icon: '👥',
    category: 'Crew',
    rarity: 'uncommon',
    tags: ['leadership', 'team', 'management'],
    triggerCondition: (job: JobData, user: UserContext) => {
      return job.isTeamJob && user.totalBookingsToday >= 2;
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      const count = user.totalBookingsToday;
      
      if (user.userMode === 'crew_leader') {
        return `Natural born leader! ${count} team jobs coordinated flawlessly. Crew Commander status: confirmed! 👥⚡`;
      }
      
      return `Leading from the front on ${count} team jobs? That's Crew Commander energy, sugar! 👥🔥`;
    }
  },

  {
    id: 'prestige-rising',
    title: 'Prestige Rising',
    description: 'Earned 3+ Canon insights in a single day.',
    canonical: false, // Meta-achievement = Non-Canon intuition
    icon: '⭐',
    category: 'Reputation',
    rarity: 'rare',
    tags: ['prestige', 'canon', 'insights'],
    triggerCondition: async (job: JobData, user: UserContext) => {
      // Mock logic: Check if user has earned multiple stamps today
      return user.prestigeRank >= 3 && Math.random() > 0.8;
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      return `Three Canon insights in one day? The platform is taking notice, darling. Prestige Rising earned! ⭐🌀`;
    }
  },

  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Completed a job before 7 AM.',
    canonical: true, // Time data = Canon
    icon: '🌅',
    category: 'Behavior',
    rarity: 'common',
    tags: ['early', 'morning', 'dedication'],
    triggerCondition: (job: JobData) => {
      const hour = job.completedAt.getHours();
      return hour < 7;
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      const hour = new Date().getHours();
      
      if (hour < 6) {
        return `Up before 6 AM? That's not just early bird, that's early LEGEND! Stamp earned with sunrise glory! 🌅🏆`;
      }
      
      return `Early bird gets the worm — and the stamp! Morning warrior status confirmed! 🌅✅`;
    }
  },

  {
    id: 'storm-rider',
    title: 'Storm Rider',
    description: 'Completed a job during adverse weather conditions.',
    canonical: false, // Weather conditions = Non-Canon guess
    icon: '⛈️',
    category: 'Behavior',
    rarity: 'uncommon',
    tags: ['weather', 'dedication', 'resilience'],
    triggerCondition: (job: JobData) => {
      // Mock logic: Random weather conditions
      return Math.random() > 0.85; // 15% chance
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      if (user.equippedTitle?.name.includes('Warrior')) {
        return `Bad weather? Not your problem! Warrior spirit confirmed — Storm Rider earned! ⛈️💪`;
      }
      
      return `Rain or shine, you deliver! Storm Rider stamped with weather-defying glory! ⛈️🌀`;
    }
  },

  {
    id: 'five-star-sweep',
    title: '5-Star Sweep',
    description: 'Earned 5 consecutive 5-star reviews.',
    canonical: true, // Review data = Canon
    icon: '⭐⭐⭐⭐⭐',
    category: 'Reputation',
    rarity: 'legendary',
    tags: ['excellence', 'reviews', 'reputation'],
    triggerCondition: async (job: JobData) => {
      // Mock logic: Check for consecutive 5-star reviews
      return job.rating === 5 && Math.random() > 0.9; // 10% chance for demo
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      if (user.prestigeRank >= 8) {
        return `Five perfect scores in a row? Excellence is your only standard, darling. 5-Star Sweep: LEGENDARY STATUS! ⭐⭐⭐⭐⭐👑`;
      }
      
      return `Five stars, five times running? That's not luck, that's pure skill! 5-Star Sweep earned! ⭐⭐⭐⭐⭐✅`;
    }
  },

  {
    id: 'night-shift',
    title: 'Night Shift',
    description: 'Completed a job after 10 PM.',
    canonical: true, // Time data = Canon
    icon: '🌙',
    category: 'Behavior',
    rarity: 'uncommon',
    tags: ['night', 'dedication', 'late'],
    triggerCondition: (job: JobData) => {
      const hour = job.completedAt.getHours();
      return hour >= 22; // After 10 PM
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      return `Working while the city sleeps? Night Shift warrior status confirmed! The darkness is your domain! 🌙⚡`;
    }
  },

  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Completed a job with exceptional attention to detail.',
    canonical: false, // Quality assessment = Non-Canon intuition
    icon: '💎',
    category: 'Performance',
    rarity: 'rare',
    tags: ['quality', 'detail', 'perfection'],
    triggerCondition: (job: JobData) => {
      // Mock logic: High rating + longer duration suggests attention to detail
      return job.rating === 5 && (job.duration || 0) > 120; // 2+ hours and 5 stars
    },
    voiceLine: (user: UserContext, contextData?: Record<string, any>) => {
      const duration = Math.floor((contextData?.duration || 120) / 60);
      
      return `${duration} hours of pure perfection? Every detail polished to shine. Perfectionist stamped with diamond clarity! 💎🌀`;
    }
  }
];

/**
 * Get stamp definition by ID
 */
export function getStampDefinition(stampId: string): StampDefinition | undefined {
  return STAMP_DEFINITIONS.find(stamp => stamp.id === stampId);
}

/**
 * Get stamps by category
 */
export function getStampsByCategory(category: StampDefinition['category']): StampDefinition[] {
  return STAMP_DEFINITIONS.filter(stamp => stamp.category === category);
}

/**
 * Get stamps by rarity
 */
export function getStampsByRarity(rarity: StampDefinition['rarity']): StampDefinition[] {
  return STAMP_DEFINITIONS.filter(stamp => stamp.rarity === rarity);
}

/**
 * Get Canon vs Non-Canon stamps
 */
export function getCanonStamps(): StampDefinition[] {
  return STAMP_DEFINITIONS.filter(stamp => stamp.canonical);
}

export function getNonCanonStamps(): StampDefinition[] {
  return STAMP_DEFINITIONS.filter(stamp => !stamp.canonical);
}