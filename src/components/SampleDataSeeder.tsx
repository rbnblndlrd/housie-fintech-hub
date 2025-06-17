
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SampleDataSeeder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const sampleProviders = [
    {
      business_name: "CleanPro Services",
      description: "Service de nettoyage professionnel avec 10 ans d'expérience",
      years_experience: 10,
      hourly_rate: 35,
      service_radius_km: 25,
      verified: true,
      services: [
        {
          title: "Nettoyage résidentiel complet",
          description: "Nettoyage en profondeur de votre domicile incluant toutes les pièces",
          category: "cleaning",
          subcategory: "residential",
          pricing_type: "hourly",
          base_price: 35
        },
        {
          title: "Nettoyage après construction",
          description: "Nettoyage spécialisé après travaux de construction ou rénovation",
          category: "cleaning",
          subcategory: "post_construction",
          pricing_type: "flat",
          base_price: 150
        }
      ]
    },
    {
      business_name: "GreenThumb Landscaping",
      description: "Entretien paysager écologique et durable",
      years_experience: 8,
      hourly_rate: 45,
      service_radius_km: 30,
      verified: true,
      services: [
        {
          title: "Tonte de pelouse",
          description: "Service de tonte professionnel avec ramassage inclus",
          category: "lawn_care",
          subcategory: "mowing",
          pricing_type: "flat",
          base_price: 60
        },
        {
          title: "Aménagement paysager",
          description: "Conception et installation d'aménagements paysagers sur mesure",
          category: "lawn_care",
          subcategory: "landscaping",
          pricing_type: "hourly",
          base_price: 45
        }
      ]
    },
    {
      business_name: "HandyPro Construction",
      description: "Travaux de construction et rénovation générale",
      years_experience: 15,
      hourly_rate: 55,
      service_radius_km: 40,
      verified: true,
      services: [
        {
          title: "Rénovation de salle de bain",
          description: "Rénovation complète de salle de bain clé en main",
          category: "construction",
          subcategory: "bathroom",
          pricing_type: "flat",
          base_price: 3500
        },
        {
          title: "Réparations générales",
          description: "Petites réparations et travaux de maintenance",
          category: "construction",
          subcategory: "general",
          pricing_type: "hourly",
          base_price: 55
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
      for (const providerData of sampleProviders) {
        // Create provider profile
        const { data: provider, error: providerError } = await supabase
          .from('provider_profiles')
          .insert({
            user_id: user.id, // Using current user as the provider for demo
            business_name: providerData.business_name,
            description: providerData.description,
            years_experience: providerData.years_experience,
            hourly_rate: providerData.hourly_rate,
            service_radius_km: providerData.service_radius_km,
            verified: providerData.verified,
            average_rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
            total_bookings: Math.floor(Math.random() * 50) + 10 // Random bookings 10-60
          })
          .select()
          .single();

        if (providerError) {
          console.error('Provider creation error:', providerError);
          continue;
        }

        // Create services for this provider
        for (const serviceData of providerData.services) {
          const { error: serviceError } = await supabase
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
            });

          if (serviceError) {
            console.error('Service creation error:', serviceError);
          }
        }
      }

      toast({
        title: "Données ajoutées !",
        description: "Les services d'exemple ont été créés avec succès.",
      });

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
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Données d'exemple</CardTitle>
        <CardDescription>
          Ajouter des services d'exemple pour tester le système de réservation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={seedSampleData}
          disabled={isSeeding || !user}
          className="w-full"
        >
          {isSeeding ? "Ajout en cours..." : "Ajouter des services d'exemple"}
        </Button>
        {!user && (
          <p className="text-sm text-gray-500 mt-2">
            Connectez-vous pour ajouter des données d'exemple
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SampleDataSeeder;
