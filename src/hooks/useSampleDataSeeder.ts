
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { sampleProviders } from "@/data/sampleProviders";

export const useSampleDataSeeder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const seedSampleData = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter des données.",
        variant: "destructive",
      });
      return;
    }

    setIsSeeding(true);

    try {
      console.log('🚀 Starting to seed sample providers...');
      
      for (const providerData of sampleProviders) {
        console.log(`Creating provider: ${providerData.business_name}`);
        
        // Create user for this provider
        const { data: providerUser, error: userError } = await supabase
          .from('users')
          .insert({
            email: providerData.user_data.email,
            full_name: providerData.user_data.full_name,
            city: providerData.user_data.city,
            province: providerData.user_data.province,
            phone: providerData.user_data.phone,
            user_role: 'provider',
            can_provide: true,
            can_seek: false
          })
          .select()
          .single();

        if (userError) {
          console.error('User creation error:', userError);
          // If user already exists, try to find them
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', providerData.user_data.email)
            .single();
          
          if (!existingUser) {
            continue;
          }
          var userId = existingUser.id;
        } else {
          var userId = providerUser.id;
        }

        // Create provider profile
        const { data: provider, error: providerError } = await supabase
          .from('provider_profiles')
          .insert({
            user_id: userId,
            business_name: providerData.business_name,
            description: providerData.description,
            years_experience: providerData.years_experience,
            hourly_rate: providerData.hourly_rate,
            service_radius_km: providerData.service_radius_km,
            verified: providerData.verified,
            average_rating: providerData.average_rating,
            total_bookings: providerData.total_bookings
          })
          .select()
          .single();

        if (providerError) {
          console.error('Provider creation error:', providerError);
          continue;
        }

        console.log(`✅ Created provider: ${provider.business_name}`);

        // Create services for this provider
        for (const serviceData of providerData.services) {
          const { data: service, error: serviceError } = await supabase
            .from('services')
            .insert({
              provider_id: provider.id,
              title: serviceData.title,
              description: serviceData.description,
              category: serviceData.category,
              subcategory: serviceData.subcategory,
              pricing_type: serviceData.pricing_type,
              base_price: serviceData.base_price,
              active: true
            })
            .select()
            .single();

          if (serviceError) {
            console.error('Service creation error:', serviceError);
          } else {
            console.log(`  ➕ Added service: ${service.title}`);
          }
        }
      }

      toast({
        title: "🎉 Prestataires créés avec succès!",
        description: `${sampleProviders.length} prestataires montréalais ajoutés. Prêt pour tester les réservations!`,
      });

      // Refresh the page to show new data
      window.location.reload();

    } catch (error) {
      console.error('Seeding error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout des données.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return {
    seedSampleData,
    isSeeding
  };
};
