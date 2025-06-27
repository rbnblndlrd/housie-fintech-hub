
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  MapPin, 
  Briefcase, 
  Globe, 
  Phone, 
  Users, 
  Star, 
  Edit3, 
  Shield,
  Building,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile', username],
    queryFn: async () => {
      if (!username) throw new Error('Username is required');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_role_preferences(primary_role, secondary_roles)
        `)
        .eq('username', username)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!username
  });

  const { data: services } = useQuery({
    queryKey: ['user-services', profile?.user_id],
    queryFn: async () => {
      if (!profile?.user_id) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', profile.user_id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.user_id
  });

  const { data: reviews } = useQuery({
    queryKey: ['user-reviews', profile?.user_id],
    queryFn: async () => {
      if (!profile?.user_id) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:user_profiles!reviews_reviewer_id_fkey(username, full_name, profile_image_url)
        `)
        .eq('provider_id', profile.user_id)
        .eq('verified_transaction', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.user_id
  });

  const isOwnProfile = user?.id === profile?.user_id;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 font-medium">Loading profile...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
          <div className="container mx-auto px-4 py-8">
            <Card className="fintech-card text-center py-16">
              <CardContent>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
                <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist.</p>
                <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Go Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Profile Header */}
          <Card className="fintech-card mb-8">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profile_image_url} alt={profile.full_name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {profile.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                      {profile.is_verified && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-lg mb-4">@{profile.username}</p>
                    
                    {profile.bio && (
                      <p className="text-gray-700 mb-4">{profile.bio}</p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      {profile.location && profile.show_location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      
                      {profile.profession && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{profile.profession}</span>
                        </div>
                      )}
                      
                      {profile.company && (
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{profile.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <Button
                    onClick={() => navigate(`/profile/${username}/edit`)}
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
              
              {/* Stats Row */}
              <div className="flex items-center gap-8 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.network_connections_count}</div>
                  <div className="text-sm text-gray-600">Network Connections</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.total_reviews_received}</div>
                  <div className="text-sm text-gray-600">Reviews Received</div>
                </div>
                
                {profile.average_rating > 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold text-gray-900">{profile.average_rating.toFixed(1)}</span>
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Contact & Info */}
            <div className="space-y-6">
              {/* Contact Information */}
              {profile.show_contact_info && (
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.phone && (
                      <div>
                        <div className="text-sm text-gray-600">Phone</div>
                        <div className="font-medium">{profile.phone}</div>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div>
                        <div className="text-sm text-gray-600">Website</div>
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <span>{profile.website}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    
                    {profile.social_linkedin && (
                      <div>
                        <div className="text-sm text-gray-600">LinkedIn</div>
                        <a 
                          href={profile.social_linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <span>LinkedIn Profile</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Role Information */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Platform Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {profile.user_role_preferences?.[0]?.primary_role?.replace('_', ' ').toUpperCase() || 'CUSTOMER'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Services & Reviews */}
            <div className="lg:col-span-2 space-y-6">
              {/* Services Offered */}
              {services && services.length > 0 && (
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{service.category}</Badge>
                            <span className="text-sm font-medium text-green-600">
                              ${service.base_price}/{service.pricing_type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Transaction-Verified Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.reviewer?.profile_image_url} />
                              <AvatarFallback>
                                {review.reviewer?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{review.reviewer?.full_name || 'Anonymous'}</span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              </div>
                              
                              <p className="text-gray-700">{review.comment}</p>
                              
                              <div className="text-xs text-gray-500 mt-2">
                                {new Date(review.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No verified reviews yet</p>
                      <p className="text-sm">Reviews appear here after completed transactions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
