// Enhanced Clip Definitions with Context Variants for Phase 8
export interface ContextMatch {
  prestigeTier?: number;
  userMode?: 'provider' | 'customer' | 'crew_leader' | 'coordinator';
  equippedTitle?: string;
  upcomingJobsToday?: number;
  lastJobType?: string;
  totalBookingsToday?: number;
}

export interface ContextVariant {
  match: ContextMatch;
  line: string;
  canonStatus?: 'canon' | 'non_canon';
}

export interface ClipDefinition {
  id: string;
  icon: string;
  label: string;
  defaultLine: string;
  action: string;
  contextVariants: ContextVariant[];
  category?: 'core' | 'community' | 'custom';
}

// 🧠 PART 4 – Enhanced Clip Definitions with Context Variants
export const enhancedClipDefinitions: ClipDefinition[] = [
  // Core Actions Cylinder
  {
    id: 'parse-ticket',
    icon: 'FileText',
    label: 'Parse Ticket',
    defaultLine: "Mmm… juicy. Let's dissect this one.",
    action: 'parse_ticket',
    category: 'core',
    contextVariants: [
      {
        match: { prestigeTier: 0 },
        line: "First ticket? Don't worry, baby — I'll walk you through this like a pro. Let's break it down! ✅",
        canonStatus: 'canon'
      },
      {
        match: { equippedTitle: 'Commander of Clean' },
        line: "Commander on deck! This cleaning job is about to get the full military breakdown. ✅",
        canonStatus: 'canon'
      },
      {
        match: { totalBookingsToday: 3 },
        line: "Third ticket today? You're on fire! Let me parse this beauty with extra precision. ✅",
        canonStatus: 'canon'
      }
    ]
  },
  
  {
    id: 'optimize-route',
    icon: 'Compass',
    label: 'Optimize Route',
    defaultLine: "Let's get strategic, sugar. Optimizing your steps!",
    action: 'optimize_route',
    category: 'core',
    contextVariants: [
      {
        match: { prestigeTier: 0 },
        line: "You're new here, baby! Let me show you the ropes — optimized and ready. ✅",
        canonStatus: 'canon'
      },
      {
        match: { equippedTitle: 'Road Warrior' },
        line: "Road Warrior mode activated! Your tires might be tired... but not you. Let's optimize! ✅",
        canonStatus: 'canon'
      },
      {
        match: { upcomingJobsToday: 1 },
        line: "One hour 'til game time — let's optimize this route, sugar! ⏰ ✅",
        canonStatus: 'canon'
      },
      {
        match: { userMode: 'provider' },
        line: "Provider power-up! Let's map the most efficient path to maximize your earnings. 🌀",
        canonStatus: 'non_canon'
      }
    ]
  },

  {
    id: 'check-prestige',
    icon: 'Star',
    label: 'Check Prestige',
    defaultLine: "Flex check: incoming. ✨ You're climbing like a boss!",
    action: 'check_prestige',
    category: 'core',
    contextVariants: [
      {
        match: { prestigeTier: 0 },
        line: "Let's check your progress, rookie! Everyone starts somewhere — and you're doing great! ✅",
        canonStatus: 'canon'
      },
      {
        match: { prestigeTier: 4 },
        line: "Look who's back for more glory! Your prestige speaks for itself, darling. ✅",
        canonStatus: 'canon'
      },
      {
        match: { totalBookingsToday: 3 },
        line: "Three jobs today?! You're absolutely crushing it — Canon verified! ✅",
        canonStatus: 'canon'
      },
      {
        match: { userMode: 'crew_leader' },
        line: "Crew Leader checking in! Your team's prestige reflects your leadership. 🌀",
        canonStatus: 'non_canon'
      }
    ]
  },

  {
    id: 'suggest-provider',
    icon: 'Users',
    label: 'Suggest Provider',
    defaultLine: "I've got someone perfect in mind...",
    action: 'suggest_provider',
    category: 'core',
    contextVariants: [
      {
        match: { lastJobType: 'cleaning' },
        line: "Cleaning specialist detected! I know exactly who handles sparkle like a pro. ✅",
        canonStatus: 'canon'
      },
      {
        match: { lastJobType: 'pet' },
        line: "I sniff potential in your area! Pet care jobs detected — Canon confirmed! ✅",
        canonStatus: 'canon'
      },
      {
        match: { userMode: 'customer' },
        line: "Customer mode: activated. Let me find you someone with proven track record. ✅",
        canonStatus: 'canon'
      },
      {
        match: { prestigeTier: 0 },
        line: "New to hiring? I'll find you someone patient and highly rated. Perfect starter match! 🌀",
        canonStatus: 'non_canon'
      }
    ]
  },

  {
    id: 'scan-crew-potential',
    icon: 'Users2',
    label: 'Scan Crew Potential',
    defaultLine: "Let me sniff out some crew potential...",
    action: 'scan_crew_potential',
    category: 'core',
    contextVariants: [
      {
        match: { userMode: 'crew_leader' },
        line: "Crew Leader vibes! Your leadership data shows strong team-building potential. ✅",
        canonStatus: 'canon'
      },
      {
        match: { prestigeTier: 4 },
        line: "Veteran status detected! You've got the cred to attract top-tier crew members. ✅",
        canonStatus: 'canon'
      },
      {
        match: { totalBookingsToday: 2 },
        line: "Active leader energy! Perfect time to scout for crew expansion. 🌀",
        canonStatus: 'non_canon'
      },
      {
        match: { userMode: 'provider' },
        line: "Provider transitioning to crew leadership? I can analyze your networking potential. 🌀",
        canonStatus: 'non_canon'
      }
    ]
  },

  // Community Cylinder Enhanced
  {
    id: 'top-connections',
    icon: 'Users',
    label: 'Top Connections',
    defaultLine: "These folks adore you. And honestly, same.",
    action: 'top_connections',
    category: 'community',
    contextVariants: [
      {
        match: { userMode: 'provider' },
        line: "Provider network analysis: Your repeat customers are your greatest asset. ✅",
        canonStatus: 'canon'
      },
      {
        match: { prestigeTier: 4 },
        line: "Elite network detected! These connections are your prestige foundation. ✅",
        canonStatus: 'canon'
      },
      {
        match: { totalBookingsToday: 0 },
        line: "Perfect time to reconnect! Your network misses that professional charm. 🌀",
        canonStatus: 'non_canon'
      }
    ]
  },

  {
    id: 'city-broadcast',
    icon: 'Radio',
    label: 'City Broadcast',
    defaultLine: "Here's what's echoing across town...",
    action: 'city_broadcast',
    category: 'community',
    contextVariants: [
      {
        match: { userMode: 'coordinator' },
        line: "Coordinator intel: The city pulse shows optimal job distribution patterns. ✅",
        canonStatus: 'canon'
      },
      {
        match: { equippedTitle: 'Road Warrior' },
        line: "Road Warrior frequency active! You're hearing the streets' best-kept secrets. ✅",
        canonStatus: 'canon'
      },
      {
        match: { prestigeTier: 0 },
        line: "Welcome to the city's heartbeat! This is where the community shares knowledge. 🌀",
        canonStatus: 'non_canon'
      }
    ]
  }
];

// Helper function to find clip definition by ID
export function getClipDefinition(clipId: string): ClipDefinition | undefined {
  return enhancedClipDefinitions.find(clip => clip.id === clipId);
}

// Helper function to get clips by category
export function getClipsByCategory(category: 'core' | 'community' | 'custom'): ClipDefinition[] {
  return enhancedClipDefinitions.filter(clip => clip.category === category);
}