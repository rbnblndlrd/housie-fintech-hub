
export interface MontrealProvider {
  id: number;
  name: string;
  lat: number;
  lng: number;
  service: string;
  rating: number;
  availability: string;
  serviceRadius?: number;
  verified?: boolean;
  hourlyRate?: number;
  distance?: string;
}

export const montrealProviders: MontrealProvider[] = [
  {
    id: 1,
    name: "Montreal Cleaning Pro",
    lat: 45.5017,
    lng: -73.5673,
    service: "Emergency Cleaning",
    rating: 4.8,
    availability: "Available",
    serviceRadius: 15,
    verified: true,
    hourlyRate: 45,
    distance: "1.2 km"
  },
  {
    id: 2,
    name: "QuickFix Electrical",
    lat: 45.5088,
    lng: -73.5878,
    service: "Electrical Repair",
    rating: 4.9,
    availability: "Available",
    serviceRadius: 20,
    verified: true,
    hourlyRate: 75,
    distance: "2.8 km"
  },
  {
    id: 3,
    name: "Plateau Plumbing",
    lat: 45.5276,
    lng: -73.5794,
    service: "Emergency Plumbing",
    rating: 4.7,
    availability: "Busy",
    serviceRadius: 12,
    verified: true,
    hourlyRate: 65,
    distance: "3.1 km"
  }
];
