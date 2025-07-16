import React from 'react';
import { ServiceLayoutType } from '@/hooks/useServiceLayout';

// Cleaning Bookings Components
import CleaningIncomingJobsTable from './layouts/cleaning/CleaningIncomingJobsTable';
import CleaningMiniCalendar from './layouts/cleaning/CleaningMiniCalendar';
import CleaningAcceptDeclineWidget from './layouts/cleaning/CleaningAcceptDeclineWidget';
import CleaningSuggestedRebook from './layouts/cleaning/CleaningSuggestedRebook';

// Tattoo Bookings Components
import TattooVisualCalendar from './layouts/tattoo/TattooVisualCalendar';
import TattooPrepSheets from './layouts/tattoo/TattooPrepSheets';
import TattooRebookingReminders from './layouts/tattoo/TattooRebookingReminders';
import TattooRecentReviews from './layouts/tattoo/TattooRecentReviews';

// Default Bookings Components
import KanbanTicketList from './KanbanTicketList';
import CalendarPreview from '@/components/calendar/CalendarPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingsLayoutControllerProps {
  layoutType: ServiceLayoutType;
  bookings: any[];
  loading?: boolean;
  onBookingUpdate?: () => void;
  className?: string;
}

const BookingsLayoutController: React.FC<BookingsLayoutControllerProps> = ({
  layoutType,
  bookings,
  loading = false,
  onBookingUpdate,
  className = ""
}) => {
  const renderCleaningLayout = () => (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CleaningIncomingJobsTable bookings={bookings} loading={loading} />
        </div>
        <div className="space-y-4">
          <CleaningMiniCalendar bookings={bookings} />
          <CleaningAcceptDeclineWidget />
        </div>
      </div>
      <CleaningSuggestedRebook bookings={bookings} />
    </div>
  );

  const renderTattooLayout = () => (
    <div className={`space-y-6 ${className}`}>
      <TattooVisualCalendar bookings={bookings} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TattooPrepSheets bookings={bookings} />
        <TattooRebookingReminders bookings={bookings} />
      </div>
      <TattooRecentReviews />
    </div>
  );

  const renderDefaultLayout = () => (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <KanbanTicketList />
          </CardContent>
        </Card>
        <Card className="fintech-card">
          <CardContent className="p-0">
            <CalendarPreview />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  switch (layoutType) {
    case 'cleaning':
      return renderCleaningLayout();
    case 'tattoo':
      return renderTattooLayout();
    default:
      return renderDefaultLayout();
  }
};

export default BookingsLayoutController;