import React from 'react';
import { Wrench } from 'lucide-react';
import PrestigeTrackSection from './PrestigeTrackSection';

interface ServiceSpecificTracksProps {
  searchTerm: string;
  activeTrack: string | null;
  setActiveTrack: (trackId: string | null) => void;
  statusFilter?: string;
  activeSection?: string | null;
  setActiveSection?: (sectionId: string | null) => void;
  viewMode?: 'preview' | 'detailed';
}

const ServiceSpecificTracks: React.FC<ServiceSpecificTracksProps> = ({
  searchTerm,
  activeTrack,
  setActiveTrack,
  statusFilter,
  activeSection,
  setActiveSection,
  viewMode
}) => {
  const serviceSpecificTracks = [
    {
      id: 'appliance-tech-repair',
      title: 'Appliance & Tech Repair',
      subtitle: 'The Fix-It Phantoms',
      emoji: '🔧',
      color: 'from-blue-600 to-cyan-600',
      description: 'Master the art of technical repair and appliance restoration',
      levels: [
        { title: 'Brand Connoisseur', jobsRequired: 25, timeEstimate: '1-3 months', status: 'completed' as const },
        { title: 'Diagnostic Prodigy', jobsRequired: 75, timeEstimate: '3-9 months', status: 'completed' as const },
        { title: 'Circuit Expert', jobsRequired: 150, timeEstimate: '6-18 months', status: 'completed' as const },
        { title: 'Warranty Wizard', jobsRequired: 250, timeEstimate: '1-2.5 years', status: 'current' as const, currentJobs: 187 },
        { title: 'The Specialist', jobsRequired: 350, timeEstimate: '1.5-3.5 years', status: 'locked' as const },
        { title: 'Technomancer', jobsRequired: 500, timeEstimate: '2-5 years', status: 'locked' as const }
      ]
    },
    {
      id: 'cleaning-services',
      title: 'Cleaning Services',
      subtitle: 'The Spotless Squad',
      emoji: '🧹',
      color: 'from-green-600 to-emerald-600',
      description: 'Achieve mastery in residential and commercial cleaning excellence',
      levels: [
        { title: 'Speed Cleaner', jobsRequired: 25, timeEstimate: '1-2 months', status: 'completed' as const },
        { title: 'The Organizer', jobsRequired: 75, timeEstimate: '3-6 months', status: 'completed' as const },
        { title: 'Chemical Connoisseur', jobsRequired: 150, timeEstimate: '6-12 months', status: 'current' as const, currentJobs: 89 },
        { title: 'Stain Slayer', jobsRequired: 250, timeEstimate: '1-2 years', status: 'locked' as const },
        { title: 'Move-Out Magician', jobsRequired: 350, timeEstimate: '2-3 years', status: 'locked' as const },
        { title: 'SPOTLESS', jobsRequired: 500, timeEstimate: '2-4 years', status: 'locked' as const }
      ]
    },
    {
      id: 'personal-wellness',
      title: 'Personal Wellness',
      subtitle: 'The Knot Busters',
      emoji: '💆',
      color: 'from-purple-600 to-violet-600',
      description: 'Professional wellness and therapeutic service mastery',
      levels: [
        { title: 'Pressure Point Master', jobsRequired: 50, timeEstimate: '1-3 months', status: 'completed' as const },
        { title: 'The Stress Eraser', jobsRequired: 100, timeEstimate: '3-6 months', status: 'locked' as const },
        { title: 'Mobile Miracle Worker', jobsRequired: 200, timeEstimate: '6-12 months', status: 'locked' as const },
        { title: 'Insurance Navigator', jobsRequired: 300, timeEstimate: '9-18 months', status: 'locked' as const },
        { title: 'The Recovery Coach', jobsRequired: 400, timeEstimate: '12-24 months', status: 'locked' as const },
        { title: 'The Knot Buster', jobsRequired: 500, timeEstimate: '6 months to 3+ years', status: 'locked' as const }
      ]
    },
    {
      id: 'exterior-grounds',
      title: 'Exterior & Grounds',
      subtitle: 'The Outdoor Crew',
      emoji: '🌿',
      color: 'from-green-600 to-lime-600',
      description: 'Landscaping, yard work, and outdoor maintenance expertise',
      levels: [
        { title: 'Weed Warrior', jobsRequired: 30, timeEstimate: '1-2 months', status: 'locked' as const },
        { title: 'Pressure Perfect', jobsRequired: 75, timeEstimate: '3-6 months', status: 'locked' as const },
        { title: 'The Landscaper', jobsRequired: 150, timeEstimate: '6-12 months', status: 'locked' as const },
        { title: 'Risk Assessor', jobsRequired: 250, timeEstimate: '1-2 years', status: 'locked' as const },
        { title: 'Drought Defier', jobsRequired: 350, timeEstimate: '2-3 years', status: 'locked' as const },
        { title: 'Woodpecker', jobsRequired: 500, timeEstimate: '2-4 years', status: 'locked' as const }
      ]
    },
    {
      id: 'pet-care',
      title: 'Pet Care Services',
      subtitle: 'The Paw Patrol',
      emoji: '🐕',
      color: 'from-orange-600 to-red-600',
      description: 'Professional pet sitting, walking, and care services',
      levels: [
        { title: 'The Pet Whisperer', jobsRequired: 50, timeEstimate: '2-4 months', status: 'locked' as const },
        { title: 'Animal Lover', jobsRequired: 100, timeEstimate: '4-8 months', status: 'locked' as const },
        { title: 'Ruff Around the Edges', jobsRequired: 200, timeEstimate: '8-16 months', status: 'locked' as const },
        { title: 'Paws & Reflect', jobsRequired: 300, timeEstimate: '1-2 years', status: 'locked' as const },
        { title: 'Pack Leader', jobsRequired: 400, timeEstimate: '1.5-3 years', status: 'locked' as const },
        { title: 'The Alpha', jobsRequired: 500, timeEstimate: '2-4 years', status: 'locked' as const }
      ]
    },
    {
      id: 'event-services',
      title: 'Event Services',
      subtitle: 'The Stage Commanders',
      emoji: '🎪',
      color: 'from-pink-600 to-rose-600',
      description: 'Event setup, coordination, and entertainment services',
      levels: [
        { title: 'Load-In Legend', jobsRequired: 15, timeEstimate: '2-6 months', status: 'locked' as const },
        { title: 'Time Crunch Hero', jobsRequired: 40, timeEstimate: '6-16 months', status: 'locked' as const },
        { title: 'Sound Sage', jobsRequired: 75, timeEstimate: '1-2.5 years', status: 'locked' as const },
        { title: 'Stage Architect', jobsRequired: 125, timeEstimate: '1.5-4 years', status: 'locked' as const },
        { title: 'Party Coordinator', jobsRequired: 175, timeEstimate: '2-5 years', status: 'locked' as const },
        { title: 'Showtime', jobsRequired: 250, timeEstimate: '3-7 years', status: 'locked' as const }
      ]
    },
    {
      id: 'moving-delivery',
      title: 'Moving & Delivery',
      subtitle: 'The Heavy Lifters',
      emoji: '🚚',
      color: 'from-gray-600 to-slate-600',
      description: 'Professional moving, delivery, and transportation services',
      levels: [
        { title: 'Tetris Apprentice', jobsRequired: 25, timeEstimate: '1-3 months', status: 'locked' as const },
        { title: 'Assembly Expert', jobsRequired: 75, timeEstimate: '3-9 months', status: 'locked' as const },
        { title: 'Relocator', jobsRequired: 150, timeEstimate: '6-18 months', status: 'locked' as const },
        { title: 'Road Warrior', jobsRequired: 250, timeEstimate: '1-2.5 years', status: 'locked' as const },
        { title: 'Time Saver', jobsRequired: 350, timeEstimate: '1.5-3.5 years', status: 'locked' as const },
        { title: 'Handler', jobsRequired: 500, timeEstimate: '2-5 years', status: 'locked' as const }
      ]
    }
  ];

  return (
    <PrestigeTrackSection
      title="Service-Specific Prestige Tracks"
      subtitle="Master your craft through specialized service progression"
      icon={<Wrench className="h-6 w-6 text-blue-600" />}
      tracks={serviceSpecificTracks}
      searchTerm={searchTerm}
      activeTrack={activeTrack}
      setActiveTrack={setActiveTrack}
      sectionId="service-specific"
      statusFilter={statusFilter}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      viewMode={viewMode}
      defaultExpanded={true}
    />
  );
};

export default ServiceSpecificTracks;