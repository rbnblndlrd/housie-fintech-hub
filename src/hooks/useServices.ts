
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service";
import { fallbackServices } from "@/data/sampleServices";

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
      console.log('Raw data details:', data?.map(service => ({
        id: service.id,
        title: service.title,
        category: service.category,
        subcategory: service.subcategory,
        provider_id: service.provider_id,
        has_provider: !!service.provider,
        provider_details: service.provider ? {
          business_name: service.provider.business_name,
          has_user: !!service.provider.user
        } : null
      })));

      if (error) {
        console.error('Error fetching services:', error);
        console.log('Using fallback services due to query error');
        setServices(fallbackServices.map(service => ({
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
        })));
        return;
      }

      if (!data || data.length === 0) {
        console.log('No services found in database, using fallback services');
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
        return;
      }

      console.log(`Found ${data.length} services in database`);
      
      // Filter out services with incomplete provider data and log them
      const validServices = data.filter(service => {
        const hasProvider = service.provider && service.provider.user;
        if (!hasProvider) {
          console.warn('Service missing provider or user data:', {
            service_id: service.id,
            title: service.title,
            category: service.category,
            provider_id: service.provider_id,
            has_provider: !!service.provider,
            provider_user: service.provider?.user || null
          });
        }
        return hasProvider;
      });

      console.log(`${validServices.length} services have complete provider data`);
      console.log('Valid services by category:', validServices.reduce((acc, service) => {
        acc[service.category] = (acc[service.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));

      // If no valid services but we have services in DB, it means provider profiles are missing
      if (validServices.length === 0 && data.length > 0) {
        console.warn('Services found but no provider profiles or user data. This suggests missing provider_profiles or users records.');
        
        // Show fallback services but also show a message about the issue
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

      // Combine database services with fallback services
      const allServices = [...processedServices, ...fallbackServices.map(service => ({
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
      }))];

      console.log(`Setting ${allServices.length} total services (${processedServices.length} from DB + ${fallbackServices.length} fallback)`);
      setServices(allServices);
      
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
