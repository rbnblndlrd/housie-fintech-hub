import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DropPoint {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  radius_m: number;
  type: 'community' | 'historic' | 'event' | 'seasonal';
  bonus_stamp_id?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserImprint {
  id: string;
  user_id: string;
  drop_point_id: string;
  drop_point?: DropPoint;
  action_type: 'job' | 'visit' | 'event' | 'rebook' | 'stamp_unlock';
  timestamp: string;
  canonical: boolean;
  service_type?: string;
  optional_note?: string;
  stamp_triggered_id?: string;
  coordinates?: [number, number];
  created_at: string;
}

export interface NearbyDropPoint {
  drop_point_id: string;
  name: string;
  type: string;
  distance_m: number;
  bonus_stamp_id?: string;
}

export const useDropPoints = () => {
  return useQuery({
    queryKey: ['drop-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drop_points')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;

      return data.map(point => ({
        ...point,
        coordinates: [(point.coordinates as any).x, (point.coordinates as any).y] as [number, number]
      })) as DropPoint[];
    }
  });
};

export const useUserImprints = (userId?: string) => {
  return useQuery({
    queryKey: ['user-imprints', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_imprints')
        .select(`
          *,
          drop_point:drop_points(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data.map(imprint => ({
        ...imprint,
        coordinates: imprint.coordinates ? [(imprint.coordinates as any).x, (imprint.coordinates as any).y] : undefined,
        drop_point: imprint.drop_point ? {
          ...imprint.drop_point,
          coordinates: [(imprint.drop_point.coordinates as any).x, (imprint.drop_point.coordinates as any).y]
        } : undefined
      })) as UserImprint[];
    },
    enabled: !!userId
  });
};

export const useNearbyDropPoints = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (coordinates: [number, number]) => {
      const { data, error } = await supabase.rpc('find_nearby_drop_points', {
        p_coordinates: `(${coordinates[0]},${coordinates[1]})`,
        p_max_distance_m: 1000
      });

      if (error) throw error;
      return data as NearbyDropPoint[];
    },
    onError: (error) => {
      console.error('Error finding nearby drop points:', error);
      toast({
        title: "Location Error",
        description: "Could not find nearby drop points",
        variant: "destructive",
      });
    }
  });
};

export const useLogImprint = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      userId,
      coordinates,
      actionType,
      serviceType,
      note
    }: {
      userId: string;
      coordinates: [number, number];
      actionType: string;
      serviceType?: string;
      note?: string;
    }) => {
      const { data, error } = await supabase.rpc('log_imprint', {
        p_user_id: userId,
        p_coordinates: `(${coordinates[0]},${coordinates[1]})`,
        p_action_type: actionType,
        p_service_type: serviceType,
        p_note: note
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (result, variables) => {
      const resultData = result as any;
      if (resultData?.success) {
        queryClient.invalidateQueries({ queryKey: ['user-imprints', variables.userId] });
        
        const imprintsCreated = resultData.imprints_created || 0;
        if (imprintsCreated > 0) {
          toast({
            title: "📍 Imprint Logged",
            description: `Canonized ${imprintsCreated} location${imprintsCreated > 1 ? 's' : ''}.`,
          });

          if (resultData.stamp_awarded) {
            toast({
              title: "🌟 Stamp Unlocked!",
              description: `You earned the "${resultData.stamp_awarded}" stamp!`,
            });
          }
        }
      }
    },
    onError: (error) => {
      console.error('Error logging imprint:', error);
      toast({
        title: "Imprint Failed",
        description: "Could not log location imprint",
        variant: "destructive",
      });
    }
  });
};

export const useCurrentPosition = () => {
  const { toast } = useToast();

  const getCurrentPosition = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Access Denied",
            description: "Enable location services to use drop points",
            variant: "destructive",
          });
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  return { getCurrentPosition };
};