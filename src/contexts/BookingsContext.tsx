import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  provider: string;
  location: string;
  status: string;
  customer_name: string;
  total_amount: number;
  category?: string;
  subcategory?: string;
  hasLinkedService?: boolean;
  description?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  preferred_date?: string;
  preferred_time?: string;
  service_address?: string;
  instructions?: string;
  custom_title?: string;
  service_title?: string;
}

interface BookingsContextType {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export const useBookingsContext = () => {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error('useBookingsContext must be used within a BookingsProvider');
  }
  return context;
};

export const BookingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // First, get bookings where user is the customer
      // Use LEFT JOIN for services to handle nullable service_id
      const { data: customerBookings, error: customerError } = await supabase
        .from('bookings')
        .select(`
          id,
          scheduled_date,
          scheduled_time,
          service_address,
          instructions,
          total_amount,
          status,
          category,
          subcategory,
          service_title,
          custom_title,
          services(title, category),
          provider_profiles!left(
            business_name,
            users(full_name)
          )
        `)
        .eq('customer_id', user.id)
        .order('scheduled_date', { ascending: false });

      if (customerError) {
        console.error('Error fetching customer bookings:', customerError);
        throw customerError;
      }

      // Then, get bookings where user is the provider
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let providerBookings: any[] = [];
      if (providerProfile) {
        const { data, error: providerError } = await supabase
          .from('bookings')
          .select(`
            id,
            scheduled_date,
            scheduled_time,
            service_address,
            instructions,
            total_amount,
            status,
            category,
            subcategory,
            service_title,
            custom_title,
            services(title, category),
            users!inner(full_name)
          `)
          .eq('provider_id', providerProfile.id)
          .order('scheduled_date', { ascending: false });

        if (providerError) {
          console.error('Error fetching provider bookings:', providerError);
        } else {
          providerBookings = data || [];
        }
      }

      // Combine and format all bookings
      const allBookings = [
        ...(customerBookings || []).map((booking: any) => ({
          id: booking.id,
          serviceName: booking.custom_title || booking.services?.title || booking.service_title || 
                      (booking.subcategory ? `Generic ${booking.subcategory}` : 'Service Request'),
          date: booking.scheduled_date,
          time: booking.scheduled_time,
          provider: booking.provider_profiles?.business_name || 
                   booking.provider_profiles?.users?.full_name || 'Awaiting Assignment',
          location: booking.service_address || 'No address provided',
          status: booking.status || 'pending',
          customer_name: 'You', // Since this is the customer's booking
          total_amount: booking.total_amount || 0,
          category: booking.category || booking.services?.category,
          subcategory: booking.subcategory,
          hasLinkedService: !!booking.services?.title,
          custom_title: booking.custom_title,
          service_title: booking.service_title,
          // Additional fields for detailed view
          description: booking.instructions,
          scheduled_date: booking.scheduled_date,
          scheduled_time: booking.scheduled_time,
          preferred_date: booking.scheduled_date,
          preferred_time: booking.scheduled_time
        })),
        ...providerBookings.map((booking: any) => ({
          id: booking.id,
          serviceName: booking.custom_title || booking.services?.title || booking.service_title || 
                      (booking.subcategory ? `Generic ${booking.subcategory}` : 'Service Request'),
          date: booking.scheduled_date,
          time: booking.scheduled_time,
          provider: 'You', // Since this is the provider's booking
          location: booking.service_address || 'No address provided',
          status: booking.status || 'pending',
          customer_name: booking.users?.full_name || 'Unknown Customer',
          total_amount: booking.total_amount || 0,
          category: booking.category || booking.services?.category,
          subcategory: booking.subcategory,
          hasLinkedService: !!booking.services?.title,
          custom_title: booking.custom_title,
          service_title: booking.service_title,
          // Additional fields for detailed view
          description: booking.instructions,
          scheduled_date: booking.scheduled_date,
          scheduled_time: booking.scheduled_time,
          preferred_date: booking.scheduled_date,
          preferred_time: booking.scheduled_time
        }))
      ];

      // Remove duplicates based on ID
      const uniqueBookings = allBookings.filter((booking, index, self) => 
        index === self.findIndex((b) => b.id === booking.id)
      );

      setBookings(uniqueBookings);
    } catch (err) {
      console.error('Error in fetchBookings:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    setLoading(true);
    await fetchBookings();
  };

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    fetchBookings();

    // Set up real-time subscription only if we don't have one already
    if (!subscriptionRef.current) {
      const channel = supabase
        .channel('bookings_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: `customer_id=eq.${user.id},provider_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Booking change detected:', payload);
            setTimeout(() => {
              fetchBookings();
            }, 100);
          }
        )
        .subscribe();

      console.log('Subscribed to bookings_changes');
      subscriptionRef.current = channel;
    }

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        console.log('Unsubscribed from bookings_changes');
        subscriptionRef.current = null;
      }
    };
  }, [user?.id]);

  return (
    <BookingsContext.Provider value={{ bookings, loading, error, refetch }}>
      {children}
    </BookingsContext.Provider>
  );
};