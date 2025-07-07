import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface PokemonGOJob {
  id: string;
  title: string;
  type: 'individual' | 'opportunity' | 'emergency';
  coordinates: { lat: number; lng: number };
  price: number;
  customer: string;
  phone: string;
  address: string;
  timeEstimate: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  description: string;
  requirements?: string[];
  postedTime: string;
  distance?: string;
}

export interface Provider {
  id: string;
  name: string;
  type: 'individual' | 'crew';
  coordinates: { lat: number; lng: number };
  rating: number;
  achievement: string;
  available: boolean;
  service_categories: string[];
}

export interface JobStats {
  totalJobs: number;
  emergencyJobs: number;
  avgPayment: number;
  nearbyProviders: number;
}

export const usePokemonGOJobs = () => {
  const [jobs, setJobs] = useState<PokemonGOJob[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [stats, setStats] = useState<JobStats>({
    totalJobs: 0,
    emergencyJobs: 0,
    avgPayment: 0,
    nearbyProviders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate sample data with Montreal coordinates
  const generateSampleJobs = (): PokemonGOJob[] => {
    const montrealCenter = { lat: 45.5017, lng: -73.5673 };
    const sampleJobs: Omit<PokemonGOJob, 'coordinates' | 'postedTime' | 'distance'>[] = [
      {
        id: '1',
        title: 'Kitchen Sink Repair',
        type: 'individual',
        price: 85,
        customer: 'Sarah Johnson',
        phone: '(514) 555-0123',
        address: '123 Main St, Downtown Montreal',
        timeEstimate: '1-2 hours',
        priority: 'medium',
        description: 'Kitchen sink is clogged and water is backing up',
        requirements: ['Plumbing tools', 'Drain snake']
      },
      {
        id: '2',
        title: 'Emergency Furnace Repair',
        type: 'emergency',
        price: 250,
        customer: 'Mike Chen',
        phone: '(514) 555-0456',
        address: '456 Oak Ave, Plateau',
        timeEstimate: '2-3 hours',
        priority: 'emergency',
        description: 'Furnace not working, family needs heat urgently',
        requirements: ['HVAC certification', 'Emergency response']
      },
      {
        id: '3',
        title: 'Office Cleaning Crew Needed',
        type: 'opportunity',
        price: 450,
        customer: 'Corporate Tower Ltd',
        phone: '(514) 555-0789',
        address: '789 Business District, Montreal',
        timeEstimate: '4-6 hours',
        priority: 'high',
        description: 'Large office complex needs thorough cleaning team',
        requirements: ['Cleaning crew (3+ people)', 'Commercial equipment']
      },
      {
        id: '4',
        title: 'Appliance Installation',
        type: 'individual',
        price: 120,
        customer: 'Emily Rodriguez',
        phone: '(514) 555-0321',
        address: '321 Elm St, Westmount',
        timeEstimate: '2-3 hours',
        priority: 'low',
        description: 'New dishwasher needs installation and setup',
        requirements: ['Appliance experience', 'Basic tools']
      },
      {
        id: '5',
        title: 'Electrical Wiring Emergency',
        type: 'emergency',
        price: 180,
        customer: 'David Wilson',
        phone: '(514) 555-0987',
        address: '987 Pine St, Verdun',
        timeEstimate: '1-3 hours',
        priority: 'emergency',
        description: 'Power outage in half the house, possible wiring issue',
        requirements: ['Licensed electrician', 'Emergency equipment']
      },
      {
        id: '6',
        title: 'Moving Team Required',
        type: 'opportunity',
        price: 320,
        customer: 'Maria Santos',
        phone: '(514) 555-0654',
        address: '654 Maple Ave, NDG',
        timeEstimate: '3-5 hours',
        priority: 'medium',
        description: '3-bedroom apartment move, stairs involved',
        requirements: ['Moving crew (2+ people)', 'Moving truck', 'Equipment']
      }
    ];

    // Generate random coordinates around Montreal
    return sampleJobs.map((job, index) => {
      const offsetLat = (Math.random() - 0.5) * 0.05; // ~2.5km radius
      const offsetLng = (Math.random() - 0.5) * 0.07;
      const minutesAgo = Math.floor(Math.random() * 180) + 5; // 5-185 minutes ago
      
      return {
        ...job,
        coordinates: {
          lat: montrealCenter.lat + offsetLat,
          lng: montrealCenter.lng + offsetLng
        },
        postedTime: `${minutesAgo < 60 ? minutesAgo + ' mins' : Math.floor(minutesAgo / 60) + 'h ' + (minutesAgo % 60) + 'm'} ago`,
        distance: `${(Math.random() * 10 + 0.5).toFixed(1)} km`
      };
    });
  };

  const generateSampleProviders = (): Provider[] => {
    const montrealCenter = { lat: 45.5017, lng: -73.5673 };
    const sampleProviders: Omit<Provider, 'coordinates'>[] = [
      {
        id: '1',
        name: 'Alex Thompson',
        type: 'individual',
        rating: 4.8,
        achievement: 'Technomancer ⚡',
        available: true,
        service_categories: ['Electrical', 'Appliance Repair']
      },
      {
        id: '2',
        name: 'Clean Squad Montreal',
        type: 'crew',
        rating: 4.9,
        achievement: 'Spotless Squad 🧹',
        available: true,
        service_categories: ['Cleaning', 'Janitorial']
      },
      {
        id: '3',
        name: 'Marie Dubois',
        type: 'individual',
        rating: 4.7,
        achievement: 'Plumbing Pro 🔧',
        available: true,
        service_categories: ['Plumbing', 'HVAC']
      },
      {
        id: '4',
        name: 'Moving Masters Crew',
        type: 'crew',
        rating: 4.6,
        achievement: 'Logistics Leader 📦',
        available: false,
        service_categories: ['Moving', 'Delivery']
      }
    ];

    return sampleProviders.map(provider => {
      const offsetLat = (Math.random() - 0.5) * 0.04;
      const offsetLng = (Math.random() - 0.5) * 0.06;
      
      return {
        ...provider,
        coordinates: {
          lat: montrealCenter.lat + offsetLat,
          lng: montrealCenter.lng + offsetLng
        }
      };
    });
  };

  const fetchJobs = async () => {
    try {
      // For demo purposes, use sample data
      // In production, this would fetch from Supabase
      const sampleJobs = generateSampleJobs();
      setJobs(sampleJobs);
      
      // Calculate stats
      const emergencyCount = sampleJobs.filter(job => job.type === 'emergency').length;
      const avgPayment = sampleJobs.reduce((sum, job) => sum + job.price, 0) / sampleJobs.length;
      
      setStats({
        totalJobs: sampleJobs.length,
        emergencyJobs: emergencyCount,
        avgPayment: Math.round(avgPayment),
        nearbyProviders: 8
      });
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs');
    }
  };

  const fetchProviders = async () => {
    try {
      const sampleProviders = generateSampleProviders();
      setProviders(sampleProviders);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
      setError('Failed to load providers');
    }
  };

  const acceptJob = async (jobId: string) => {
    try {
      console.log('Accepting job:', jobId);
      
      // In production, this would make an API call to accept the job
      // For demo, just remove from list
      setJobs(prev => prev.filter(job => job.id !== jobId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalJobs: prev.totalJobs - 1
      }));
      
      return true;
    } catch (err) {
      console.error('Failed to accept job:', err);
      return false;
    }
  };

  const filterJobs = (type: 'all' | 'individual' | 'opportunity' | 'emergency') => {
    if (type === 'all') return jobs;
    return jobs.filter(job => job.type === type);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchProviders()]);
      setLoading(false);
    };

    loadData();

    // Set up periodic refresh (every 2 minutes)
    const interval = setInterval(() => {
      fetchJobs();
      fetchProviders();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  return {
    jobs,
    providers,
    stats,
    loading,
    error,
    acceptJob,
    filterJobs,
    refreshData: () => {
      fetchJobs();
      fetchProviders();
    }
  };
};