
import { useState, useEffect } from 'react';

export interface FleetVehicle {
  id: string;
  driverName: string;
  lat: number;
  lng: number;
  status: 'active' | 'en-route' | 'available' | 'offline';
  currentJob?: string;
  serviceType: string;
  lastUpdate: Date;
  efficiency: number;
  todayRevenue: number;
}

export interface FleetJob {
  id: string;
  vehicleId: string;
  lat: number;
  lng: number;
  priority: 'high' | 'medium' | 'low';
  serviceType: string;
  estimatedDuration: number;
  status: 'pending' | 'active' | 'completed';
}

export interface PerformanceZone {
  id: string;
  area: string;
  lat: number;
  lng: number;
  revenuePerHour: number;
  efficiency: number;
  jobCount: number;
}

export interface RouteOptimization {
  vehicleId: string;
  route: Array<{ lat: number; lng: number; order: number }>;
  estimatedTime: number;
  fuelSavings: number;
}

export const useFleetOperations = () => {
  const [activeVehicles, setActiveVehicles] = useState<FleetVehicle[]>([]);
  const [currentJobs, setCurrentJobs] = useState<FleetJob[]>([]);
  const [performanceZones, setPerformanceZones] = useState<PerformanceZone[]>([]);
  const [routeOptimization, setRouteOptimization] = useState<RouteOptimization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize fleet data
  useEffect(() => {
    const initializeFleetData = async () => {
      setIsLoading(true);
      
      // Mock fleet vehicles across Montreal/Longueuil
      const mockVehicles: FleetVehicle[] = [
        {
          id: 'FLEET-01',
          driverName: 'Marc Dubois',
          lat: 45.5017,
          lng: -73.5673,
          status: 'active',
          currentJob: 'Plumbing Emergency - Downtown',
          serviceType: 'Plumbing',
          lastUpdate: new Date(),
          efficiency: 87,
          todayRevenue: 480
        },
        {
          id: 'FLEET-02',
          driverName: 'Sophie Tremblay',
          lat: 45.5088,
          lng: -73.5878,
          status: 'en-route',
          currentJob: 'HVAC Maintenance - Westmount',
          serviceType: 'HVAC',
          lastUpdate: new Date(),
          efficiency: 92,
          todayRevenue: 650
        },
        {
          id: 'FLEET-03',
          driverName: 'Jean-Luc Martin',
          lat: 45.4972,
          lng: -73.5794,
          status: 'available',
          serviceType: 'Handyman',
          lastUpdate: new Date(),
          efficiency: 78,
          todayRevenue: 320
        },
        {
          id: 'FLEET-04',
          driverName: 'Marie Lavoie',
          lat: 45.5276,
          lng: -73.5946,
          status: 'active',
          currentJob: 'Electrical Repair - Plateau',
          serviceType: 'Electrical',
          lastUpdate: new Date(),
          efficiency: 95,
          todayRevenue: 720
        },
        {
          id: 'FLEET-05',
          driverName: 'Pierre Gagnon',
          lat: 45.4765,
          lng: -73.5990,
          status: 'en-route',
          currentJob: 'Cleaning Service - Verdun',
          serviceType: 'Cleaning',
          lastUpdate: new Date(),
          efficiency: 85,
          todayRevenue: 380
        },
        {
          id: 'FLEET-06',
          driverName: 'Isabelle Roy',
          lat: 45.5234,
          lng: -73.5620,
          status: 'active',
          currentJob: 'Painting - Mile End',
          serviceType: 'Painting',
          lastUpdate: new Date(),
          efficiency: 88,
          todayRevenue: 540
        },
        {
          id: 'FLEET-07',
          driverName: 'Luc Bouchard',
          lat: 45.4584,
          lng: -73.4684,
          status: 'available',
          serviceType: 'Landscaping',
          lastUpdate: new Date(),
          efficiency: 82,
          todayRevenue: 290
        },
        {
          id: 'FLEET-08',
          driverName: 'Nathalie Côté',
          lat: 45.5515,
          lng: -73.6520,
          status: 'active',
          currentJob: 'Appliance Repair - Ahuntsic',
          serviceType: 'Appliance',
          lastUpdate: new Date(),
          efficiency: 90,
          todayRevenue: 605
        },
        {
          id: 'FLEET-09',
          driverName: 'Daniel Fournier',
          lat: 45.4897,
          lng: -73.5456,
          status: 'en-route',
          currentJob: 'Flooring Install - Hochelaga',
          serviceType: 'Flooring',
          lastUpdate: new Date(),
          efficiency: 86,
          todayRevenue: 780
        },
        {
          id: 'FLEET-10',
          driverName: 'Catherine Morin',
          lat: 45.5645,
          lng: -73.7236,
          status: 'active',
          currentJob: 'Window Cleaning - Laval',
          serviceType: 'Cleaning',
          lastUpdate: new Date(),
          efficiency: 91,
          todayRevenue: 420
        },
        {
          id: 'FLEET-11',
          driverName: 'François Bélanger',
          lat: 45.4421,
          lng: -73.4934,
          status: 'available',
          serviceType: 'Roofing',
          lastUpdate: new Date(),
          efficiency: 84,
          todayRevenue: 950
        },
        {
          id: 'FLEET-12',
          driverName: 'Julie Pelletier',
          lat: 45.5156,
          lng: -73.6392,
          status: 'active',
          currentJob: 'Kitchen Renovation - NDG',
          serviceType: 'Renovation',
          lastUpdate: new Date(),
          efficiency: 93,
          todayRevenue: 1200
        }
      ];

      // Mock current jobs
      const mockJobs: FleetJob[] = [
        {
          id: 'JOB-001',
          vehicleId: 'FLEET-01',
          lat: 45.5017,
          lng: -73.5673,
          priority: 'high',
          serviceType: 'Emergency Plumbing',
          estimatedDuration: 120,
          status: 'active'
        },
        {
          id: 'JOB-002',
          vehicleId: 'FLEET-02',
          lat: 45.5088,
          lng: -73.5878,
          priority: 'medium',
          serviceType: 'HVAC Maintenance',
          estimatedDuration: 90,
          status: 'active'
        },
        {
          id: 'JOB-003',
          vehicleId: 'FLEET-04',
          lat: 45.5276,
          lng: -73.5946,
          priority: 'medium',
          serviceType: 'Electrical Repair',
          estimatedDuration: 75,
          status: 'active'
        }
      ];

      // Mock performance zones
      const mockPerformanceZones: PerformanceZone[] = [
        {
          id: 'PERF-001',
          area: 'Downtown Montreal',
          lat: 45.5017,
          lng: -73.5673,
          revenuePerHour: 85,
          efficiency: 92,
          jobCount: 156
        },
        {
          id: 'PERF-002',
          area: 'Westmount',
          lat: 45.4848,
          lng: -73.5915,
          revenuePerHour: 110,
          efficiency: 95,
          jobCount: 89
        },
        {
          id: 'PERF-003',
          area: 'Plateau Mont-Royal',
          lat: 45.5276,
          lng: -73.5946,
          revenuePerHour: 75,
          efficiency: 88,
          jobCount: 203
        },
        {
          id: 'PERF-004',
          area: 'Longueuil',
          lat: 45.5311,
          lng: -73.5180,
          revenuePerHour: 68,
          efficiency: 82,
          jobCount: 94
        },
        {
          id: 'PERF-005',
          area: 'Laval',
          lat: 45.5645,
          lng: -73.7236,
          revenuePerHour: 72,
          efficiency: 85,
          jobCount: 127
        },
        {
          id: 'PERF-006',
          area: 'Verdun',
          lat: 45.4580,
          lng: -73.5673,
          revenuePerHour: 63,
          efficiency: 79,
          jobCount: 78
        }
      ];

      // Mock route optimization
      const mockRoutes: RouteOptimization[] = [
        {
          vehicleId: 'FLEET-01',
          route: [
            { lat: 45.5017, lng: -73.5673, order: 1 },
            { lat: 45.5088, lng: -73.5878, order: 2 },
            { lat: 45.5156, lng: -73.6392, order: 3 }
          ],
          estimatedTime: 45,
          fuelSavings: 12
        },
        {
          vehicleId: 'FLEET-02',
          route: [
            { lat: 45.5088, lng: -73.5878, order: 1 },
            { lat: 45.4848, lng: -73.5915, order: 2 },
            { lat: 45.4972, lng: -73.5794, order: 3 }
          ],
          estimatedTime: 38,
          fuelSavings: 8
        }
      ];

      setActiveVehicles(mockVehicles);
      setCurrentJobs(mockJobs);
      setPerformanceZones(mockPerformanceZones);
      setRouteOptimization(mockRoutes);
      setIsLoading(false);

      console.log('🚛 Fleet operations data loaded:', {
        vehicles: mockVehicles.length,
        jobs: mockJobs.length,
        performanceZones: mockPerformanceZones.length,
        routes: mockRoutes.length
      });
    };

    initializeFleetData();
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setActiveVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        lat: vehicle.lat + (Math.random() - 0.5) * 0.001,
        lng: vehicle.lng + (Math.random() - 0.5) * 0.001,
        lastUpdate: new Date(),
        efficiency: Math.max(70, Math.min(100, vehicle.efficiency + (Math.random() - 0.5) * 2))
      })));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  // Calculate fleet statistics
  const fleetStats = {
    activeVehicles: activeVehicles.filter(v => v.status === 'active' || v.status === 'en-route').length,
    activeJobs: currentJobs.filter(j => j.status === 'active').length,
    todayRevenue: activeVehicles.reduce((total, vehicle) => total + vehicle.todayRevenue, 0),
    avgEfficiency: Math.round(activeVehicles.reduce((total, vehicle) => total + vehicle.efficiency, 0) / activeVehicles.length),
    completedJobs: 47 // Mock completed jobs today
  };

  return {
    activeVehicles,
    currentJobs,
    performanceZones,
    routeOptimization,
    isLoading,
    fleetStats
  };
};
