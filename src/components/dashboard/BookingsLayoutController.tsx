import React from 'react';
import { ServiceLayoutType } from '@/hooks/useServiceLayout';

// Enhanced Pre-Acceptance Components
import SmartFitPanel from '@/components/bookings/SmartFitPanel';
import EarningsImpactForecast from '@/components/bookings/EarningsImpactForecast';
import PrepRequirementsPreview from '@/components/bookings/PrepRequirementsPreview';
import ClientQuickProfile from '@/components/bookings/ClientQuickProfile';
import AcceptReasoningLog from '@/components/bookings/AcceptReasoningLog';
import CollapsedCalendar from '@/components/bookings/CollapsedCalendar';

// Cleaning Bookings Components (kept for layout consistency)
import CleaningIncomingJobsTable from './layouts/cleaning/CleaningIncomingJobsTable';
import CleaningAcceptDeclineWidget from './layouts/cleaning/CleaningAcceptDeclineWidget';
import CleaningSuggestedRebook from './layouts/cleaning/CleaningSuggestedRebook';

// Tattoo Bookings Components (kept for layout consistency)
import TattooVisualCalendar from './layouts/tattoo/TattooVisualCalendar';
import TattooPrepSheets from './layouts/tattoo/TattooPrepSheets';
import TattooRebookingReminders from './layouts/tattoo/TattooRebookingReminders';
import TattooRecentReviews from './layouts/tattoo/TattooRecentReviews';

// Home Services Components
import HomeServicesBookingTable from './layouts/home_services/HomeServicesBookingTable';
import HomeServicesSafetyReminders from './layouts/home_services/HomeServicesSafetyReminders';

// Pet Care Components
import PetCareWalkSchedule from './layouts/petcare/PetCareWalkSchedule';
import PetProfileCards from './layouts/petcare/PetProfileCards';

// Default Bookings Components
import KanbanTicketList from './KanbanTicketList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface BookingsLayoutControllerProps {
  layoutType: ServiceLayoutType;
  bookings: any[];
  loading?: boolean;
  onBookingUpdate?: () => void;
  className?: string;
  viewMode?: 'list' | 'calendar';
}

const BookingsLayoutController: React.FC<BookingsLayoutControllerProps> = ({
  layoutType,
  bookings,
  loading = false,
  onBookingUpdate,
  className = "",
  viewMode = 'list'
}) => {
  const renderCleaningLayout = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Pre-Acceptance Decision Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <SmartFitPanel />
        <EarningsImpactForecast />
        <PrepRequirementsPreview />
      </div>
      
      {/* Client Profile and Decision Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientQuickProfile />
        <AcceptReasoningLog />
      </div>
      
      {/* Incoming Jobs and Collapsed Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CleaningIncomingJobsTable bookings={bookings} loading={loading} />
        </div>
        <div className="space-y-4">
          <CollapsedCalendar bookings={bookings} />
          <CleaningAcceptDeclineWidget />
        </div>
      </div>
      
      <CleaningSuggestedRebook bookings={bookings} />
    </div>
  );

  const renderTattooLayout = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Pre-Acceptance Decision Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <SmartFitPanel />
        <EarningsImpactForecast />
        <PrepRequirementsPreview 
          requirements={[
            { id: 'tattoo-kit', name: 'Tattoo Kit', icon: <Package className="h-4 w-4" />, available: true },
            { id: 'ink-colors', name: 'Color Inks', icon: <Package className="h-4 w-4" />, available: true },
            { id: 'sterilization', name: 'Sterilization Kit', icon: <Package className="h-4 w-4" />, available: true, critical: true }
          ]}
          specialTags={['Touch-up Session', 'First-time Client', 'Large Piece (4+ hours)']}
        />
      </div>
      
      {/* Client Profile and Decision Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientQuickProfile />
        <AcceptReasoningLog />
      </div>
      
      {/* Tattoo-specific booking components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TattooVisualCalendar bookings={bookings} />
        <CollapsedCalendar bookings={bookings} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TattooPrepSheets bookings={bookings} />
        <TattooRebookingReminders bookings={bookings} />
      </div>
      
      <TattooRecentReviews />
    </div>
  );

  const renderHomeServicesLayout = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Pre-Acceptance Decision Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <SmartFitPanel />
        <EarningsImpactForecast />
        <PrepRequirementsPreview 
          requirements={[
            { id: 'multimeter', name: 'Multimeter', icon: <Package className="h-4 w-4" />, available: true },
            { id: 'tools', name: 'Tool Kit', icon: <Package className="h-4 w-4" />, available: true },
            { id: 'safety-gear', name: 'Safety Gear', icon: <Package className="h-4 w-4" />, available: false, critical: true }
          ]}
          specialTags={['High Voltage', 'Emergency Call', 'Permit Required']}
        />
      </div>
      
      {/* Client Profile and Decision Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientQuickProfile />
        <HomeServicesSafetyReminders />
      </div>
      
      {/* Home Services specific components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HomeServicesBookingTable bookings={bookings} loading={loading} />
        </div>
        <div className="space-y-4">
          <CollapsedCalendar bookings={bookings} />
          <AcceptReasoningLog />
        </div>
      </div>
    </div>
  );

  const renderPetcareLayout = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Pre-Acceptance Decision Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <SmartFitPanel />
        <EarningsImpactForecast />
        <PrepRequirementsPreview 
          requirements={[
            { id: 'leash', name: 'Extra Leashes', icon: <Package className="h-4 w-4" />, available: true },
            { id: 'treats', name: 'Pet Treats', icon: <Package className="h-4 w-4" />, available: true },
            { id: 'cleanup', name: 'Cleanup Bags', icon: <Package className="h-4 w-4" />, available: true }
          ]}
          specialTags={['First Time Client', 'Reactive Pet', 'Medical Needs']}
        />
      </div>
      
      {/* Client Profile and Decision Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PetProfileCards />
        <AcceptReasoningLog />
      </div>
      
      {/* Pet Care specific components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PetCareWalkSchedule bookings={bookings} loading={loading} />
        </div>
        <div className="space-y-4">
          <CollapsedCalendar bookings={bookings} />
          <ClientQuickProfile />
        </div>
      </div>
    </div>
  );

  const renderDefaultLayout = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Pre-Acceptance Decision Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <SmartFitPanel />
        <EarningsImpactForecast />
        <PrepRequirementsPreview />
      </div>
      
      {/* Client Profile and Decision Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientQuickProfile />
        <AcceptReasoningLog />
      </div>
      
      {/* Default booking components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <KanbanTicketList />
          </CardContent>
        </Card>
        <CollapsedCalendar bookings={bookings} />
      </div>
    </div>
  );

  switch (layoutType) {
    case 'cleaning':
      return renderCleaningLayout();
    case 'tattoo':
      return renderTattooLayout();
    case 'home_services':
      return renderHomeServicesLayout();
    case 'petcare':
      return renderPetcareLayout();
    default:
      return renderDefaultLayout();
  }
};

export default BookingsLayoutController;