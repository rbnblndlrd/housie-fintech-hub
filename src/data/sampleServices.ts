import { Service, Provider } from "@/types/service";

export const sampleProviders = [
  {
    id: 1,
    name: "Sophie Entretien",
    lat: 45.5017,
    lng: -73.5673,
    service: "Nettoyage de bureaux",
    rating: 4.7,
    availability: "Available",
    serviceRadius: 15
  },
  {
    id: 2,
    name: "Jean Paysagiste",
    lat: 45.5088,
    lng: -73.5878,
    service: "Aménagement paysager",
    rating: 4.9,
    availability: "Busy",
    serviceRadius: 25
  },
  {
    id: 3,
    name: "Marie Réparatrice",
    lat: 45.4995,
    lng: -73.5848,
    service: "Réparations domiciliaires",
    rating: 4.6,
    availability: "Available",
    serviceRadius: 12
  },
  {
    id: 4,
    name: "Pierre Plombier",
    lat: 45.5200,
    lng: -73.5700,
    service: "Plomberie",
    rating: 4.8,
    availability: "Available",
    serviceRadius: 20
  },
  {
    id: 5,
    name: "Claire Électricienne",
    lat: 45.4900,
    lng: -73.5600,
    service: "Services électriques",
    rating: 4.5,
    availability: "Busy",
    serviceRadius: 18
  }
];

export const fallbackServices: Service[] = [
  {
    id: 'fallback-1',
    title: "Nettoyage résidentiel complet",
    description: "Nettoyage en profondeur de votre domicile: cuisine, salle de bain, chambres, salon. Produits écologiques inclus.",
    base_price: 30,
    pricing_type: "hourly",
    category: "cleaning",
    subcategory: "residential",
    active: true,
    provider: {
      id: 'provider-1',
      business_name: "Marie Nettoyage",
      hourly_rate: 30,
      service_radius_km: 25,
      average_rating: 4.8,
      total_bookings: 127,
      verified: true,
      user: {
        full_name: "Marie Dubois",
        city: "Montréal",
        province: "QC"
      }
    }
  },
  {
    id: 'fallback-2',
    title: "Tonte de pelouse professionnelle",
    description: "Tonte, bordures et ramassage des résidus. Service hebdomadaire ou ponctuel disponible.",
    base_price: 75,
    pricing_type: "flat",
    category: "lawn_care",
    subcategory: "mowing",
    active: true,
    provider: {
      id: 'provider-2',
      business_name: "Jean Paysagiste",
      hourly_rate: 35,
      service_radius_km: 30,
      average_rating: 4.9,
      total_bookings: 89,
      verified: true,
      user: {
        full_name: "Jean-Pierre Lavoie",
        city: "Montréal",
        province: "QC"
      }
    }
  },
  {
    id: 'fallback-3',
    title: "Entretien ménager régulier",
    description: "Service d'entretien hebdomadaire ou bi-hebdomadaire. Aspirateur, serpillière, surfaces.",
    base_price: 28,
    pricing_type: "hourly",
    category: "cleaning",
    subcategory: "maintenance",
    active: true,
    provider: {
      id: 'provider-3',
      business_name: "Sophie Entretien",
      hourly_rate: 28,
      service_radius_km: 20,
      average_rating: 4.7,
      total_bookings: 94,
      verified: true,
      user: {
        full_name: "Sophie Martin",
        city: "Montréal",
        province: "QC"
      }
    }
  }
];
