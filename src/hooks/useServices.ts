
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service";

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    try {
      console.log('Fetching services from database...');
      
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:provider_profiles!inner(
            id,
            business_name,
            hourly_rate,
            service_radius_km,
            average_rating,
            total_bookings,
            verified,
            verification_level,
            background_check_verified,
            ccq_verified,
            rbq_verified,
            user:users!inner(full_name, city, province)
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      console.log('Services query result:', { data, error });

      if (error) {
        console.error('Error fetching services:', error);
        // Don't use fallback services - just empty array
        setServices([]);
        return;
      }

      if (!data || data.length === 0) {
        console.log('No services found in database');
        setServices([]);
        return;
      }

      console.log(`Found ${data.length} services in database`);
      
      // Filter out services with incomplete provider data
      const validServices = data.filter(service => {
        const hasProvider = service.provider && service.provider.user;
        if (!hasProvider) {
          console.warn('Service missing provider or user data:', service);
        }
        return hasProvider;
      });

      console.log(`${validServices.length} services have complete provider data`);

      if (validServices.length === 0 && data.length > 0) {
        console.warn('Services found but no provider profiles or user data.');
        setServices([]);
        return;
      }

      const processedServices = validServices.map(service => ({
        ...service,
        provider: {
          ...service.provider,
          verification_level: service.provider.verification_level || 'basic' as const,
          background_check_verified: service.provider.background_check_verified || false,
          ccq_verified: service.provider.ccq_verified || false,
          rbq_verified: service.provider.rbq_verified || false
        }
      }));

      console.log(`Setting ${processedServices.length} services from database`);
      setServices(processedServices);
      
    } catch (error) {
      console.error('Services fetch error:', error);
      // No fallback - just empty array
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, isLoading, refetch: fetchServices };
};
