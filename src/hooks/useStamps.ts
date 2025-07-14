import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserStamps, 
  getUserStampImprints, 
  getUserStampStats,
  UserStamp,
  StampImprint
} from '@/utils/stampEngine';

interface StampStats {
  totalStamps: number;
  stampsByCategory: Record<string, number>;
  recentStamps: UserStamp[];
}

export function useStamps() {
  const { user } = useAuth();
  const [stamps, setStamps] = useState<UserStamp[]>([]);
  const [imprints, setImprints] = useState<StampImprint[]>([]);
  const [stats, setStats] = useState<StampStats>({
    totalStamps: 0,
    stampsByCategory: {},
    recentStamps: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStampData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const [stampsData, imprintsData, statsData] = await Promise.all([
        getUserStamps(user.id),
        getUserStampImprints(user.id),
        getUserStampStats(user.id)
      ]);

      setStamps(stampsData);
      setImprints(imprintsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stamp data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stamps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadStampData();
    }
  }, [user?.id]);

  const refreshStamps = () => {
    if (user?.id) {
      loadStampData();
    }
  };

  return {
    stamps,
    imprints,
    stats,
    loading,
    error,
    refreshStamps
  };
}

export function useStampsByCategory() {
  const { stamps } = useStamps();
  
  const stampsByCategory = stamps.reduce((acc, userStamp) => {
    const category = userStamp.stamp?.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(userStamp);
    return acc;
  }, {} as Record<string, UserStamp[]>);

  return stampsByCategory;
}

export function usePinnedImprints() {
  const { imprints } = useStamps();
  
  const pinnedImprints = imprints.filter(imprint => imprint.isPinned);
  
  return pinnedImprints;
}