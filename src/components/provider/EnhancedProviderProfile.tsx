
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Users, 
  Camera, 
  Award, 
  Handshake, 
  Smile,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedProviderProfileProps {
  providerId: string;
}

interface ProviderStats {
  network_connections: number;
  total_reviews: number;
  average_rating: number;
  quality_commendations: number;
  reliability_commendations: number;
  courtesy_commendations: number;
}

interface ReviewPhoto {
  id: string;
  photo_url: string;
  uploaded_at: string;
}

export const EnhancedProviderProfile: React.FC<EnhancedProviderProfileProps> = ({
  providerId
}) => {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [photos, setPhotos] = useState<ReviewPhoto[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderData();
  }, [providerId]);

  const fetchProviderData = async () => {
    try {
      // Fetch provider stats
      const { data: profileData, error: profileError } = await supabase
        .from('provider_profiles')
        .select(`
          network_connections,
          total_reviews,
          average_rating,
          quality_commendations,
          reliability_commendations,
          courtesy_commendations
        `)
        .eq('id', providerId)
        .single();

      if (profileError) throw profileError;
      setStats(profileData);

      // Fetch review photos
      const { data: photosData, error: photosError } = await supabase
        .from('review_photos')
        .select('id, photo_url, uploaded_at')
        .eq('allow_portfolio_use', true)
        .in('review_id', 
          supabase
            .from('reviews')
            .select('id')
            .eq('provider_id', providerId)
        )
        .order('uploaded_at', { ascending: false })
        .limit(20);

      if (photosError) throw photosError;
      setPhotos(photosData || []);
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (loading) {
    return <div className="animate-pulse">Loading provider profile...</div>;
  }

  if (!stats) {
    return <div>Provider not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Provider Stats */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-orange-500" />
            Provider Reputation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.network_connections}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Users className="h-4 w-4" />
                Network Connections
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.total_reviews}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Star className="h-4 w-4" />
                Total Reviews
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.average_rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                Average Rating
              </div>
            </div>
            
            <div className="text-center md:col-span-1 col-span-2">
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <Badge className="bg-yellow-100 text-yellow-800 mb-1">
                    {stats.quality_commendations}
                  </Badge>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Quality
                  </div>
                </div>
                <div className="text-center">
                  <Badge className="bg-blue-100 text-blue-800 mb-1">
                    {stats.reliability_commendations}
                  </Badge>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Handshake className="h-3 w-3" />
                    Reliability
                  </div>
                </div>
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-800 mb-1">
                    {stats.courtesy_commendations}
                  </Badge>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Smile className="h-3 w-3" />
                    Courtesy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Photo Gallery */}
      {photos.length > 0 && (
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6 text-purple-500" />
              Customer Photo Gallery
            </CardTitle>
            <p className="text-sm text-gray-600">
              Real photos from completed jobs ({photos.length} photos)
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={photos[currentPhotoIndex]?.photo_url}
                  alt="Completed work"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex justify-center gap-2 mt-4">
                    {photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentPhotoIndex ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
