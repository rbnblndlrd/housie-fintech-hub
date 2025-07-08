import React from 'react';
import { Crown } from 'lucide-react';
import PrestigeTrackSection from './PrestigeTrackSection';

interface PlatformMasteryTracksProps {
  searchTerm: string;
  activeTrack: string | null;
  setActiveTrack: (trackId: string | null) => void;
  statusFilter?: string;
  activeSection?: string | null;
  setActiveSection?: (sectionId: string | null) => void;
  viewMode?: 'preview' | 'detailed';
}

const PlatformMasteryTracks: React.FC<PlatformMasteryTracksProps> = ({
  searchTerm,
  activeTrack,
  setActiveTrack,
  statusFilter,
  activeSection,
  setActiveSection,
  viewMode
}) => {
  const platformMasteryTracks = [
    {
      id: 'platform-milestones',
      title: 'Platform Milestones',
      subtitle: 'General Achievement Progression',
      emoji: '🎯',
      color: 'from-blue-600 to-indigo-600',
      description: 'Milestone achievements for overall platform progression',
      levels: [
        { title: 'First Service', jobsRequired: 1, timeEstimate: 'Immediate', status: 'completed' as const },
        { title: '10 Jobs Completed', jobsRequired: 10, timeEstimate: '1-3 months', status: 'completed' as const },
        { title: '50 Jobs Completed', jobsRequired: 50, timeEstimate: '3-6 months', status: 'completed' as const },
        { title: '100 Jobs Milestone', jobsRequired: 100, timeEstimate: '6-12 months', status: 'completed' as const },
        { title: '250 Jobs Champion', jobsRequired: 250, timeEstimate: '1-2 years', status: 'completed' as const },
        { title: '500 Jobs Expert', jobsRequired: 500, timeEstimate: '2-3 years', status: 'current' as const, currentJobs: 487 },
        { title: '1,000 Jobs Legend', jobsRequired: 1000, timeEstimate: '3-5 years', status: 'locked' as const }
      ]
    },
    {
      id: 'consistency-availability',
      title: 'Consistency & Availability',
      subtitle: 'Reliable Service Delivery',
      emoji: '📅',
      color: 'from-green-600 to-teal-600',
      description: 'Demonstrate consistent availability and service delivery',
      levels: [
        { title: 'Always Available', jobsRequired: 0, timeEstimate: '4+ weeks', status: 'locked' as const },
        { title: 'The Reliable', jobsRequired: 50, timeEstimate: '6-12 months', status: 'current' as const, currentJobs: 45 },
        { title: 'Weekend Warrior', jobsRequired: 50, timeEstimate: '6-12 months', status: 'locked' as const },
        { title: 'The Steady', jobsRequired: 0, timeEstimate: '20+ weeks', status: 'locked' as const }
      ]
    },
    {
      id: 'platform-mastery',
      title: 'Platform Mastery',
      subtitle: 'Advanced Feature Usage',
      emoji: '🎓',
      color: 'from-purple-600 to-pink-600',
      description: 'Master all platform features and capabilities',
      levels: [
        { title: 'Feature Explorer', jobsRequired: 0, timeEstimate: 'Variable', status: 'completed' as const },
        { title: 'Photo Pro', jobsRequired: 100, timeEstimate: '6-12 months', status: 'completed' as const },
        { title: 'Profile Perfectionist', jobsRequired: 0, timeEstimate: 'Ongoing', status: 'completed' as const }
      ]
    },
    {
      id: 'community-support',
      title: 'Community Support',
      subtitle: 'Helping Others',
      emoji: '🆘',
      color: 'from-orange-600 to-red-600',
      description: 'Support other community members and handle emergencies',
      levels: [
        { title: 'The Helper', jobsRequired: 25, timeEstimate: '6-12 months', status: 'locked' as const },
        { title: 'Emergency Responder', jobsRequired: 10, timeEstimate: '12-18 months', status: 'locked' as const },
        { title: 'Backup Buddy', jobsRequired: 15, timeEstimate: '12-18 months', status: 'locked' as const }
      ]
    },
    {
      id: 'customer-experience',
      title: 'Customer Experience',
      subtitle: 'Excellence in Service',
      emoji: '🌟',
      color: 'from-yellow-600 to-orange-600',
      description: 'Deliver exceptional customer experiences consistently',
      levels: [
        { title: 'Customer Champion', jobsRequired: 100, timeEstimate: '8-16 months', status: 'current' as const, currentJobs: 89 },
        { title: 'The Educator', jobsRequired: 0, timeEstimate: 'Ongoing', status: 'locked' as const },
        { title: 'Problem Solver', jobsRequired: 20, timeEstimate: '12-24 months', status: 'locked' as const }
      ]
    },
    {
      id: 'miles-mobility',
      title: 'Miles & Mobility',
      subtitle: 'Geographic Coverage',
      emoji: '🚗',
      color: 'from-indigo-600 to-blue-600',
      description: 'Cover extensive service areas and travel distances',
      levels: [
        { title: 'Road Warrior', jobsRequired: 0, timeEstimate: 'Variable', status: 'completed' as const },
        { title: 'The Nomad', jobsRequired: 25, timeEstimate: '6-12 months', status: 'completed' as const },
        { title: 'The Traveler', jobsRequired: 0, timeEstimate: 'Variable', status: 'current' as const, currentJobs: 4200 },
        { title: "Claude's Co-Pilot", jobsRequired: 100, timeEstimate: '12-18 months', status: 'locked' as const }
      ]
    },
    {
      id: 'meta-prestige',
      title: 'Meta-Prestige: "Kind of a Big Deal"',
      subtitle: 'Ultimate Achievement Collection',
      emoji: '👑',
      color: 'from-gradient-start to-gradient-end',
      description: 'Collect multiple achievements across all categories to unlock meta-prestige',
      levels: [
        { title: 'Kind of a Big Deal', jobsRequired: 5, timeEstimate: '6-12 months', status: 'completed' as const },
        { title: 'People Know Me', jobsRequired: 10, timeEstimate: '12-18 months', status: 'completed' as const },
        { title: 'I\'m Very Important', jobsRequired: 15, timeEstimate: '18-24 months', status: 'current' as const, currentJobs: 13 },
        { title: 'I Have Many Satisfied Customers', jobsRequired: 20, timeEstimate: '2-3 years', status: 'locked' as const },
        { title: 'My Reputation Precedes Me', jobsRequired: 25, timeEstimate: '3-4 years', status: 'locked' as const },
        { title: 'God Walking Amongst Mere Mortals', jobsRequired: 30, timeEstimate: '4-5 years', status: 'locked' as const }
      ]
    }
  ];

  return (
    <PrestigeTrackSection
      title="Platform Mastery Tracks"
      subtitle="Master HOUSIE platform features and achieve ultimate recognition"
      icon={<Crown className="h-6 w-6 text-purple-600" />}
      tracks={platformMasteryTracks}
      searchTerm={searchTerm}
      activeTrack={activeTrack}
      setActiveTrack={setActiveTrack}
      sectionId="platform-mastery"
      statusFilter={statusFilter}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      viewMode={viewMode}
    />
  );
};

export default PlatformMasteryTracks;