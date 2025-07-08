import React from 'react';
import { Users } from 'lucide-react';
import PrestigeTrackSection from './PrestigeTrackSection';

interface CustomerTracksProps {
  searchTerm: string;
  activeTrack: string | null;
  setActiveTrack: (trackId: string | null) => void;
  statusFilter?: string;
  activeSection?: string | null;
  setActiveSection?: (sectionId: string | null) => void;
  viewMode?: 'preview' | 'detailed';
}

const CustomerTracks: React.FC<CustomerTracksProps> = ({
  searchTerm,
  activeTrack,
  setActiveTrack,
  statusFilter,
  activeSection,
  setActiveSection,
  viewMode
}) => {
  const customerTracks = [
    {
      id: 'review-feedback-champions',
      title: 'Review & Feedback Champions',
      subtitle: 'Community Contributors',
      emoji: '💬',
      color: 'from-blue-600 to-cyan-600',
      description: 'Help build the community through detailed reviews and feedback',
      levels: [
        { title: 'The Reviewer', jobsRequired: 25, timeEstimate: '3-6 months', status: 'completed' as const },
        { title: 'Detail Detective', jobsRequired: 50, timeEstimate: '6-12 months', status: 'current' as const, currentJobs: 38 },
        { title: 'Commendation Captain', jobsRequired: 100, timeEstimate: '12-18 months', status: 'locked' as const },
        { title: 'The Triple Giver', jobsRequired: 25, timeEstimate: '6-12 months', status: 'locked' as const }
      ]
    },
    {
      id: 'spending-loyalty',
      title: 'Spending & Loyalty',
      subtitle: 'Platform Investment',
      emoji: '💰',
      color: 'from-green-600 to-emerald-600',
      description: 'Show commitment through platform usage and investment',
      levels: [
        { title: 'The Supporter', jobsRequired: 0, timeEstimate: 'Variable', status: 'completed' as const },
        { title: 'Big Spender', jobsRequired: 0, timeEstimate: 'Variable', status: 'completed' as const },
        { title: 'Platform Patron', jobsRequired: 0, timeEstimate: 'Variable', status: 'current' as const, currentJobs: 8500 },
        { title: 'Frequent Booker', jobsRequired: 50, timeEstimate: '6-12 months', status: 'locked' as const }
      ]
    },
    {
      id: 'portfolio-contributor',
      title: 'Portfolio Contributor',
      subtitle: 'Visual Documentation',
      emoji: '📸',
      color: 'from-purple-600 to-violet-600',
      description: 'Help providers showcase their work through photo contributions',
      levels: [
        { title: 'Photo Friend', jobsRequired: 25, timeEstimate: '3-6 months', status: 'completed' as const },
        { title: 'Visual Contributor', jobsRequired: 10, timeEstimate: '6-12 months', status: 'current' as const, currentJobs: 7 },
        { title: 'The Documentarian', jobsRequired: 50, timeEstimate: '8-16 months', status: 'locked' as const }
      ]
    },
    {
      id: 'community-trust',
      title: 'Community & Trust',
      subtitle: 'Relationship Building',
      emoji: '🤝',
      color: 'from-orange-600 to-red-600',
      description: 'Build lasting relationships with providers and community',
      levels: [
        { title: 'Trust Builder', jobsRequired: 25, timeEstimate: '6-12 months', status: 'completed' as const },
        { title: 'Network Expander', jobsRequired: 10, timeEstimate: '12-18 months', status: 'locked' as const },
        { title: 'The Repeat Customer', jobsRequired: 10, timeEstimate: '6-12 months', status: 'current' as const, currentJobs: 8 },
        { title: 'Loyalty Legend', jobsRequired: 0, timeEstimate: '1+ year', status: 'locked' as const }
      ]
    },
    {
      id: 'platform-behavior',
      title: 'Platform Behavior',
      subtitle: 'Best Practices',
      emoji: '⚡',
      color: 'from-yellow-600 to-orange-600',
      description: 'Demonstrate excellent platform usage and payment behavior',
      levels: [
        { title: 'Early Responder', jobsRequired: 0, timeEstimate: 'Immediate', status: 'completed' as const },
        { title: 'The Prompt Payer', jobsRequired: 50, timeEstimate: '6-12 months', status: 'completed' as const },
        { title: 'Crew Coordinator', jobsRequired: 10, timeEstimate: '6-18 months', status: 'locked' as const },
        { title: 'Emergency Caller', jobsRequired: 5, timeEstimate: 'Variable', status: 'locked' as const }
      ]
    },
    {
      id: 'payment-platform-loyalty',
      title: 'Payment Platform Loyalty',
      subtitle: 'Secure Transactions',
      emoji: '💳',
      color: 'from-indigo-600 to-purple-600',
      description: 'Maintain excellent payment behavior and platform loyalty',
      levels: [
        { title: 'The Faithful Payer', jobsRequired: 25, timeEstimate: '3-6 months', status: 'completed' as const },
        { title: 'Platform Purist', jobsRequired: 0, timeEstimate: 'Ongoing', status: 'completed' as const },
        { title: 'Escrow Expert', jobsRequired: 50, timeEstimate: '6-12 months', status: 'current' as const, currentJobs: 43 },
        { title: 'Payment Pro', jobsRequired: 0, timeEstimate: 'Ongoing', status: 'locked' as const }
      ]
    }
  ];

  return (
    <PrestigeTrackSection
      title="Customer-Only Prestige Tracks"
      subtitle="Recognition for exceptional customer behavior and community contribution"
      icon={<Users className="h-6 w-6 text-green-600" />}
      tracks={customerTracks}
      searchTerm={searchTerm}
      activeTrack={activeTrack}
      setActiveTrack={setActiveTrack}
      sectionId="customer-only"
      statusFilter={statusFilter}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      viewMode={viewMode}
    />
  );
};

export default CustomerTracks;