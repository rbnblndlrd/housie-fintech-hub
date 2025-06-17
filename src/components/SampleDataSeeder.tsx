
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SampleDataSeeder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const sampleProviders = [
    {
      business_name: "Marie Nettoyage",
      description: "Service de nettoyage résidentiel professionnel avec 8 ans d'expérience à Montréal",
      years_experience: 8,
      hourly_rate: 30,
      service_radius_km: 25,
      verified: true,
      average_rating: 4.8,
      total_bookings: 127,
      user_data: {
        full_name: "Marie Dubois",
        city: "Montréal",
        province: "QC",
        phone: "(514) 555-0123"
      },
      services: [
        {
          title: "Nettoyage résidentiel complet",
          description: "Nettoyage en profondeur de votre domicile: cuisine, salle de bain, chambres, salon. Produits écologiques inclus.",
          category: "cleaning",
          subcategory: "residential",
          pricing_type: "hourly",
          base_price: 30
        },
        {
          title: "Grand ménage post-déménagement",
          description: "Service de nettoyage après déménagement ou rénovation. Remise à neuf complète.",
          category: "cleaning",
          subcategory: "post_move",
          pricing_type: "flat",
          base_price: 180
        }
      ]
    },
    {
      business_name: "Jean Paysagiste",
      description: "Expert en aménagement paysager et entretien de terrain depuis 12 ans",
      years_experience: 12,
      hourly_rate: 35,
      service_radius_km: 30,
      verified: true,
      average_rating: 4.9,
      total_bookings: 89,
      user_data: {
        full_name: "Jean-Pierre Lavoie",
        city: "Montréal",
        province: "QC", 
        phone: "(514) 555-0187"
      },
      services: [
        {
          title: "Tonte de pelouse professionnelle",
          description: "Tonte, bordures et ramassage des résidus. Service hebdomadaire ou ponctuel disponible.",
          category: "lawn_care",
          subcategory: "mowing",
          pricing_type: "flat",
          base_price: 75
        },
        {
          title: "Aménagement paysager complet",
          description: "Conception et installation d'aménagements paysagers sur mesure: plates-bandes, arbustes, éclairage.",
          category: "lawn_care",
          subcategory: "landscaping",
          pricing_type: "hourly",
          base_price: 35
        }
      ]
    },
    {
      business_name: "Sophie Entretien",
      description: "Services d'entretien ménager et maintenance résidentielle personnalisés",
      years_experience: 6,
      hourly_rate: 28,
      service_radius_km: 20,
      verified: true,
      average_rating: 4.7,
      total_bookings: 94,
      user_data: {
        full_name: "Sophie Martin",
        city: "Montréal", 
        province: "QC",
        phone: "(514) 555-0156"
      },
      services: [
        {
          title: "Entretien ménager régulier",
          description: "Service d'entretien hebdomadaire ou bi-hebdomadaire. Aspirateur, serpillière, surfaces.",
          category: "cleaning",
          subcategory: "maintenance",
          pricing_type: "hourly",
          base_price: 28
        },
        {
          title: "Nettoyage de bureaux",
          description: "Nettoyage professionnel d'espaces de travail. Disponible en soirée et week-ends.",
          category: "cleaning",
          subcategory: "commercial",
          pricing_type: "hourly",
          base_price: 32
        }
      ]
    }
  ];

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
        
        // Create a dummy user for this provider (using current user as fallback)
        const { data: dummyUser, error: userError } = await supabase
          .from('users')
          .insert({
            email: `${providerData.business_name.toLowerCase().replace(/\s+/g, '')}@example.com`,
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

        if (userError && !userError.message.includes('duplicate')) {
          console.error('User creation error:', userError);
          continue;
        }

        const userId = dummyUser?.id || user.id;

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

  return (
    <div className="text-center py-8">
      <div className="max-w-md mx-auto bg-white dark:bg-dark-secondary rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">🚀 Données de Test Montreal</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Ajouter des prestataires pour tester le système de réservation
        </p>
        
        <Button 
          onClick={seedSampleData}
          disabled={isSeeding || !user}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isSeeding ? "Création en cours..." : "Créer les prestataires de test"}
        </Button>
        
        {!user && (
          <p className="text-xs text-red-500 mt-2">
            Connectez-vous pour ajouter les données
          </p>
        )}
      </div>
    </div>
  );
};

export default SampleDataSeeder;
