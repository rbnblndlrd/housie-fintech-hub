
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSampleDataSeeder } from "@/hooks/useSampleDataSeeder";

const SampleDataSeeder = () => {
  const { user } = useAuth();
  const { seedSampleData, isSeeding } = useSampleDataSeeder();

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg border p-6 shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-2">🚀 Données de Test Montreal</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Ajouter des prestataires pour tester le système de réservation avec frais HOUSIE 6%
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
  );
};

export default SampleDataSeeder;
