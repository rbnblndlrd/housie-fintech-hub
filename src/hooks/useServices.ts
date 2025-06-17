
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service";
import { fallbackServices } from "@/data/sampleServices";

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:provider_profiles(
            id,
            business_name,
            hourly_rate,
            service_radius_km,
            average_rating,
            total_bookings,
            verified,
            user:users(full_name, city, province)
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        setServices(fallbackServices);
      } else {
        const allServices = data && data.length > 0 ? data : fallbackServices;
        setServices(allServices);
      }
    } catch (error) {
      console.error('Services fetch error:', error);
      setServices(fallbackServices);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, isLoading, refetch: fetchServices };
};
