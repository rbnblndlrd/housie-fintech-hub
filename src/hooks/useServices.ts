
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
            verification_level,
            background_check_verified,
            ccq_verified,
            rbq_verified,
            user:users(full_name, city, province)
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        // Map fallback services to include new fields
        const updatedFallbackServices = fallbackServices.map(service => ({
          ...service,
          background_check_required: service.category === 'wellness' || service.category === 'care_pets',
          ccq_rbq_required: service.category === 'construction',
          risk_category: service.category === 'wellness' || service.category === 'care_pets' ? 'high' : 'low',
          provider: {
            ...service.provider,
            verification_level: 'basic' as const,
            background_check_verified: false,
            ccq_verified: false,
            rbq_verified: false
          }
        }));
        setServices(updatedFallbackServices);
      } else {
        const allServices = data && data.length > 0 ? data : fallbackServices.map(service => ({
          ...service,
          background_check_required: false,
          ccq_rbq_required: false,
          risk_category: 'low',
          provider: {
            ...service.provider,
            verification_level: 'basic' as const,
            background_check_verified: false,
            ccq_verified: false,
            rbq_verified: false
          }
        }));
        setServices(allServices);
      }
    } catch (error) {
      console.error('Services fetch error:', error);
      setServices(fallbackServices.map(service => ({
        ...service,
        background_check_required: false,
        ccq_rbq_required: false,
        risk_category: 'low',
        provider: {
          ...service.provider,
          verification_level: 'basic' as const,
          background_check_verified: false,
          ccq_verified: false,
          rbq_verified: false
        }
      })));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, isLoading, refetch: fetchServices };
};
