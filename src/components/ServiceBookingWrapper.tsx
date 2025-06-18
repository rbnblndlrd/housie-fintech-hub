
import React from 'react';
import Header from "@/components/Header";
import BookingForm from "@/components/BookingForm";
import { Service } from "@/types/service";

interface ServiceBookingWrapperProps {
  service: Service;
  onBookingComplete: (bookingId: string) => void;
  onCancel: () => void;
}

const ServiceBookingWrapper: React.FC<ServiceBookingWrapperProps> = ({
  service,
  onBookingComplete,
  onCancel
}) => {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-background">
        <BookingForm
          service={service}
          provider={service.provider}
          onBookingComplete={onBookingComplete}
          onCancel={onCancel}
        />
      </div>
    </>
  );
};

export default ServiceBookingWrapper;
