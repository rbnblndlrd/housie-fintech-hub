import React from 'react';
import { Trophy } from 'lucide-react';
import PrestigeTrackSection from './PrestigeTrackSection';

interface RecognitionTracksProps {
  searchTerm: string;
  activeTrack: string | null;
  setActiveTrack: (trackId: string | null) => void;
  statusFilter?: string;
  activeSection?: string | null;
  setActiveSection?: (sectionId: string | null) => void;
  viewMode?: 'preview' | 'detailed';
}

const RecognitionTracks: React.FC<RecognitionTracksProps> = ({
  searchTerm,
  activeTrack,
  setActiveTrack,
  statusFilter,
  activeSection,
  setActiveSection,
  viewMode
}) => {
  const recognitionTracks = [
    {
      id: 'balanced-excellence',
      title: 'Balanced Excellence',
      subtitle: 'The Missing Cog',
      emoji: '🏆',
      color: 'from-yellow-600 to-orange-600',
      description: 'Achieve balance across all recognition categories with minimal point gaps',
      levels: [
        { title: 'Balanced Professional', jobsRequired: 15, timeEstimate: '2-4 months', status: 'completed' as const },
        { title: 'Well-Rounded Expert', jobsRequired: 30, timeEstimate: '4-8 months', status: 'completed' as const },
        { title: 'Source of Excellence', jobsRequired: 50, timeEstimate: '8-12 months', status: 'completed' as const },
        { title: 'Master of All Trades', jobsRequired: 75, timeEstimate: '12-18 months', status: 'current' as const, currentJobs: 68 },
        { title: 'Origin of Perfection', jobsRequired: 100, timeEstimate: '18-24 months', status: 'locked' as const }
      ]
    },
    {
      id: 'behavioral-excellence',
      title: 'Behavioral Excellence',
      subtitle: 'Performance & Engagement',
      emoji: '⚡',
      color: 'from-blue-600 to-indigo-600',
      description: 'Master platform engagement and professional behavior standards',
      levels: [
        { title: 'Lightning Response', jobsRequired: 0, timeEstimate: 'Immediate', status: 'completed' as const },
        { title: 'Same Day Savior', jobsRequired: 50, timeEstimate: '3-6 months', status: 'completed' as const },
        { title: 'Network Navigator', jobsRequired: 100, timeEstimate: '6-12 months', status: 'current' as const, currentJobs: 87 },
        { title: 'Team Player', jobsRequired: 50, timeEstimate: '4-8 months', status: 'locked' as const },
        { title: 'Weekend Warrior', jobsRequired: 50, timeEstimate: '6-12 months', status: 'locked' as const }
      ]
    },
    {
      id: 'commendation-champions',
      title: 'Commendation Champions',
      subtitle: 'Recognition Specialists',
      emoji: '🗣️',
      color: 'from-green-600 to-teal-600',
      description: 'Excel in specific types of customer recognition',
      levels: [
        { title: 'Quality Collector', jobsRequired: 100, timeEstimate: '6-12 months', status: 'completed' as const },
        { title: 'Reliability Rockstar', jobsRequired: 100, timeEstimate: '6-12 months', status: 'completed' as const },
        { title: 'Courtesy King/Queen', jobsRequired: 100, timeEstimate: '6-12 months', status: 'current' as const, currentJobs: 73 },
        { title: 'The Triple Threat', jobsRequired: 25, timeEstimate: '4-8 months', status: 'locked' as const }
      ]
    },
    {
      id: 'financial-mastery',
      title: 'Financial Mastery',
      subtitle: 'Business Growth',
      emoji: '💰',
      color: 'from-emerald-600 to-green-600',
      description: 'Build your business and achieve financial milestones',
      levels: [
        { title: 'The Earner', jobsRequired: 0, timeEstimate: 'Variable', status: 'completed' as const },
        { title: 'Revenue Rocket', jobsRequired: 0, timeEstimate: 'Variable', status: 'completed' as const },
        { title: 'The Entrepreneur', jobsRequired: 0, timeEstimate: 'Variable', status: 'current' as const, currentJobs: 7500 },
        { title: 'Price Point Pro', jobsRequired: 0, timeEstimate: 'Variable', status: 'locked' as const }
      ]
    },
    {
      id: 'review-rating-mastery',
      title: 'Review & Rating Mastery',
      subtitle: 'Customer Satisfaction',
      emoji: '📝',
      color: 'from-purple-600 to-pink-600',
      description: 'Excel in customer feedback and satisfaction metrics',
      levels: [
        { title: 'The Feedback Magnet', jobsRequired: 100, timeEstimate: '6-12 months', status: 'completed' as const },
        { title: 'Perfect Storm', jobsRequired: 50, timeEstimate: '4-8 months', status: 'current' as const, currentJobs: 34 },
        { title: 'Consistency King/Queen', jobsRequired: 100, timeEstimate: '8-16 months', status: 'locked' as const },
        { title: 'Review Reciprocator', jobsRequired: 0, timeEstimate: 'Ongoing', status: 'locked' as const }
      ]
    },
    {
      id: 'community-collaboration',
      title: 'Community & Collaboration',
      subtitle: 'Network Building',
      emoji: '🤝',
      color: 'from-indigo-600 to-purple-600',
      description: 'Build lasting professional relationships and crews',
      levels: [
        { title: 'Loyal', jobsRequired: 0, timeEstimate: '1+ year', status: 'locked' as const },
        { title: 'Dedicated', jobsRequired: 0, timeEstimate: '2+ years', status: 'locked' as const },
        { title: 'Devoted', jobsRequired: 0, timeEstimate: '3+ years', status: 'locked' as const },
        { title: 'Crew Starter', jobsRequired: 0, timeEstimate: 'Variable', status: 'locked' as const }
      ]
    },
    {
      id: 'speed-responsiveness',
      title: 'Speed & Responsiveness',
      subtitle: 'Quick Action Masters',
      emoji: '🔥',
      color: 'from-red-600 to-orange-600',
      description: 'Master rapid response and availability excellence',
      levels: [
        { title: 'Quick Draw', jobsRequired: 0, timeEstimate: 'Immediate', status: 'completed' as const },
        { title: 'Lightning Response', jobsRequired: 0, timeEstimate: 'Immediate', status: 'completed' as const },
        { title: 'Same Day Savior', jobsRequired: 50, timeEstimate: '3-6 months', status: 'completed' as const },
        { title: 'Quickshot', jobsRequired: 100, timeEstimate: '6-12 months', status: 'current' as const, currentJobs: 67 }
      ]
    }
  ];

  return (
    <PrestigeTrackSection
      title="Recognition Prestige Tracks"
      subtitle="Earn community acknowledgment through excellence and behavior"
      icon={<Trophy className="h-6 w-6 text-yellow-600" />}
      tracks={recognitionTracks}
      searchTerm={searchTerm}
      activeTrack={activeTrack}
      setActiveTrack={setActiveTrack}
      sectionId="recognition"
      statusFilter={statusFilter}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      viewMode={viewMode}
    />
  );
};

export default RecognitionTracks;