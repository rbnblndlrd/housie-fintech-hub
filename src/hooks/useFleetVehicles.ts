
import { useState, useEffect } from 'react';

export interface FleetVehicle {
  id: string;
  driverName: string;
  vehicleNumber: string;
  lat: number;
  lng: number;
  status: 'available' | 'en-route' | 'on-job' | 'returning' | 'offline';
  currentJob?: string;
  lastUpdate: Date;
  color: string;
}

export const useFleetVehicles = () => {
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([
    {
      id: 'vehicle-1',
      driverName: 'Marc Dubois',
      vehicleNumber: 'HOUSIE-01',
      lat: 45.5017,
      lng: -73.5673,
      status: 'on-job',
      currentJob: 'Plumbing Repair - Downtown',
      lastUpdate: new Date(),
      color: '#10b981'
    },
    {
      id: 'vehicle-2',
      driverName: 'Sophie Tremblay',
      vehicleNumber: 'HOUSIE-02',
      lat: 45.5088,
      lng: -73.5878,
      status: 'en-route',
      currentJob: 'HVAC Service - Westmount',
      lastUpdate: new Date(),
      color: '#3b82f6'
    },
    {
      id: 'vehicle-3',
      driverName: 'Jean-Luc Martin',
      vehicleNumber: 'HOUSIE-03',
      lat: 45.4972,
      lng: -73.5794,
      status: 'available',
      lastUpdate: new Date(),
      color: '#f59e0b'
    },
    {
      id: 'vehicle-4',
      driverName: 'Marie Lavoie',
      vehicleNumber: 'HOUSIE-04',
      lat: 45.5276,
      lng: -73.5946,
      status: 'returning',
      currentJob: 'Electrical Work - Plateau',
      lastUpdate: new Date(),
      color: '#8b5cf6'
    },
    {
      id: 'vehicle-5',
      driverName: 'Pierre Gagnon',
      vehicleNumber: 'HOUSIE-05',
      lat: 45.4765,
      lng: -73.5990,
      status: 'on-job',
      currentJob: 'Emergency Repair - Verdun',
      lastUpdate: new Date(),
      color: '#ef4444'
    }
  ]);

  const [followFleet, setFollowFleet] = useState(false);

  // Simulate real-time vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setFleetVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        lat: vehicle.lat + (Math.random() - 0.5) * 0.002,
        lng: vehicle.lng + (Math.random() - 0.5) * 0.002,
        lastUpdate: new Date()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateFleetBounds = () => {
    if (fleetVehicles.length === 0) return null;

    const lats = fleetVehicles.map(v => v.lat);
    const lngs = fleetVehicles.map(v => v.lng);

    const bounds = {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs)
    };

    // Add 20% padding
    const latPadding = (bounds.north - bounds.south) * 0.2;
    const lngPadding = (bounds.east - bounds.west) * 0.2;

    return {
      north: bounds.north + latPadding,
      south: bounds.south - latPadding,
      east: bounds.east + lngPadding,
      west: bounds.west - lngPadding
    };
  };

  const getFleetCenter = () => {
    if (fleetVehicles.length === 0) return { lat: 45.5017, lng: -73.5673 };

    const totalLat = fleetVehicles.reduce((sum, v) => sum + v.lat, 0);
    const totalLng = fleetVehicles.reduce((sum, v) => sum + v.lng, 0);

    return {
      lat: totalLat / fleetVehicles.length,
      lng: totalLng / fleetVehicles.length
    };
  };

  return {
    fleetVehicles,
    followFleet,
    setFollowFleet,
    calculateFleetBounds,
    getFleetCenter
  };
};
