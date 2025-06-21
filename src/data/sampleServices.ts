
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

// REMOVED: fallbackServices array that was causing plain styling
// All services now come from database or show proper fintech-styled empty states
export const fallbackServices: Service[] = [];
