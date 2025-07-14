import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';

export interface PageContext {
  pageType: 'dashboard' | 'community-dashboard' | 'analytics-dashboard' | 'services' | 'profile' | 'clusters' | 'opportunities' | 'other';
  context: string;
  suggestions: string[];
  voiceTriggers: string[];
  annettePersonality: string;
}

export const usePageContext = (): PageContext => {
  const location = useLocation();
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();

  const getPageContext = (): PageContext => {
    const path = location.pathname;

    // Dashboard - Tactical Coordinator
    if (path === '/dashboard') {
      return {
        pageType: 'dashboard',
        context: `You're on the ${currentRole} dashboard. Help with job optimization, route planning, and scheduling conflicts.`,
        suggestions: [
          "Any overlap today?",
          "Reorder my jobs?",
          "Suggest better route?",
          "Help with gaps in schedule"
        ],
        voiceTriggers: [
          "Any overlap today?",
          "Reorder jobs?",
          "Route optimization?",
          "Schedule conflicts?"
        ],
        annettePersonality: "I'm your tactical coordinator, focused on optimizing your daily operations. I can help you plan routes, resolve scheduling conflicts, and maximize efficiency."
      };
    }

    // Community Dashboard - Prestige Mentor
    if (path === '/community-dashboard') {
      return {
        pageType: 'community-dashboard',
        context: "You're viewing the community dashboard. I can help with title progress, network connections, and prestige tracking.",
        suggestions: [
          "How close am I to Saint of the Sink?",
          "Which of my tracks is highest?",
          "Show me my progress",
          "Network connection tips"
        ],
        voiceTriggers: [
          "Title progress?",
          "Which track is highest?",
          "Network tips?",
          "Community ranking?"
        ],
        annettePersonality: "I'm your prestige mentor, here to guide your journey through HOUSIE's community recognition system. I track your achievements and suggest the best paths to advance your standing."
      };
    }

    // Analytics Dashboard - Strategic Analyst
    if (path === '/analytics-dashboard' || path === '/analytics') {
      return {
        pageType: 'analytics-dashboard',
        context: "You're viewing analytics. I can summarize metrics, identify trends, and provide strategic insights.",
        suggestions: [
          "Summarize my revenue trends",
          "Explain this chart",
          "Forecast my quarterly earnings",
          "Identify performance anomalies"
        ],
        voiceTriggers: [
          "Revenue summary?",
          "Performance trends?",
          "Quarterly forecast?",
          "Explain insights?"
        ],
        annettePersonality: "I'm your strategic analyst, transforming your data into actionable insights. I help you understand patterns, forecast outcomes, and make data-driven decisions."
      };
    }

    // Services - Booking Guide
    if (path === '/services') {
      return {
        pageType: 'services',
        context: "You're browsing services. I can help choose providers, explain ratings, and guide bookings.",
        suggestions: [
          "Help me find providers nearby",
          "Explain this provider's ratings",
          "What do these badges mean?",
          "Compare service options"
        ],
        voiceTriggers: [
          "Find providers?",
          "Explain ratings?",
          "Badge meanings?",
          "Service comparison?"
        ],
        annettePersonality: "I'm your booking guide, helping you navigate the marketplace with confidence. I can explain provider credentials, compare options, and ensure you make informed choices."
      };
    }

    // Profile Pages - Trust Explainer
    if (path.includes('/profile') || path.includes('/provider-profile')) {
      return {
        pageType: 'profile',
        context: "You're viewing a profile. I can explain credentials, achievements, and trust indicators.",
        suggestions: [
          "Explain this provider's credentials",
          "What do these titles mean?",
          "Break down the ratings",
          "Trust score explanation"
        ],
        voiceTriggers: [
          "Explain credentials?",
          "Title meanings?",
          "Rating breakdown?",
          "Trust explanation?"
        ],
        annettePersonality: "I'm your trust explainer, helping you understand what makes providers reliable and skilled. I break down achievements, ratings, and verification status clearly."
      };
    }

    // Clusters - Cluster Assistant
    if (path.includes('/cluster')) {
      return {
        pageType: 'clusters',
        context: "You're managing clusters. I can help with organization, activation requirements, and coordination.",
        suggestions: [
          "Help activate this cluster",
          "Explain participation requirements",
          "Suggest time blocks",
          "Coordination tips"
        ],
        voiceTriggers: [
          "Activation help?",
          "Requirements?",
          "Time suggestions?",
          "Coordination tips?"
        ],
        annettePersonality: "I'm your cluster assistant, specializing in group coordination and community organization. I help ensure smooth collaboration and successful cluster activation."
      };
    }

    // Opportunities - Crew Bid Advisor
    if (path.includes('/opportunities')) {
      return {
        pageType: 'opportunities',
        context: "You're viewing an opportunity page. I can help explain crew bids, compare proposals, and guide your decision-making process.",
        suggestions: [
          "What does this bid mean?",
          "Who should I pick?",
          "Help me compare crews",
          "Explain revenue splits",
          "What if no crews show up?"
        ],
        voiceTriggers: [
          "Explain this bid?",
          "Compare crews?",
          "Revenue split help?",
          "Bid guidance?"
        ],
        annettePersonality: "I'm your proposal advisor, helping you navigate crew bids with confidence. I explain complex scheduling, break down revenue splits, and guide you toward the best choice for your project."
      };
    }

    // Default/Other pages
    return {
      pageType: 'other',
      context: "I'm here to help with any HOUSIE-related questions or platform navigation.",
      suggestions: [
        "Platform navigation help",
        "General HOUSIE questions",
        "Feature explanations",
        "Getting started guide"
      ],
      voiceTriggers: [
        "Navigation help?",
        "How does this work?",
        "Feature guide?",
        "Getting started?"
      ],
      annettePersonality: "I'm Annette, your HOUSIE assistant. I'm here to help with any questions about the platform, guide you through features, and ensure you get the most out of HOUSIE."
    };
  };

  return getPageContext();
};