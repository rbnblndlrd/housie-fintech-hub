
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service } from '@/types/service';
import ServiceBookingWrapper from '@/components/ServiceBookingWrapper';
import ProviderProfileNavigation from '@/components/ProviderProfileNavigation';
import ProviderProfileHeader from '@/components/ProviderProfileHeader';
import ProviderServicesList from '@/components/ProviderServicesList';
import ProviderReviewSystem from '@/components/provider/ProviderReviewSystem';
import ProviderServiceGallery from '@/components/provider/ProviderServiceGallery';
import MapSection from '@/components/MapSection';
import { sampleProviderProfiles } from '@/data/sampleProviderProfiles';
import { useToast } from '@/hooks/use-toast';

const PublicProviderProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'gallery'>('services');

  // Try to fetch from database first, then fallback to sample data
  const { data: provider, isLoading } = useQuery({
    queryKey: ['public-provider', id],
    queryFn: async () => {
      if (!id) throw new Error('Provider ID is required');
      
      // First try to get from database
      try {
        const { data, error } = await supabase
          .from('provider_profiles')
          .select(`
            *,
            user:users!inner(full_name, email, phone, city, province),
            services:services(*)
          `)
          .eq('id', id)
          .single();

        if (data && !error) {
          return data;
        }
      } catch (dbError) {
        console.log('Database provider not found, trying sample data:', dbError);
      }

      // Fallback to sample data
      const sampleProvider = sampleProviderProfiles.find(p => p.id === id);
      if (!sampleProvider) {
        throw new Error('Provider not found');
      }

      // Convert sample data to expected format
      return {
        id: sampleProvider.id,
        business_name: sampleProvider.businessName,
        description: sampleProvider.description,
        hourly_rate: sampleProvider.hourlyRate,
        service_radius_km: 25,
        average_rating: sampleProvider.averageRating,
        total_bookings: sampleProvider.totalBookings,
        verified: sampleProvider.verified,
        verification_level: 'basic',
        background_check_verified: sampleProvider.backgroundCheck,
        ccq_verified: false,
        rbq_verified: false,
        user: {
          full_name: sampleProvider.fullName,
          email: sampleProvider.email,
          phone: sampleProvider.phone,
          city: sampleProvider.city,
          province: sampleProvider.province
        },
        services: sampleProvider.services.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          base_price: s.basePrice,
          pricing_type: s.pricingType,
          category: s.category,
          subcategory: s.category,
          active: true,
          background_check_required: false,
          ccq_rbq_required: false,
          risk_category: 'low'
        })),
        // Add sample-specific data
        _sampleData: sampleProvider
      };
    },
    enabled: !!id
  });

  const handleBookNow = (service: any) => {
    if (!provider) return;
    
    const formattedService: Service = {
      id: service.id,
      title: service.title,
      description: service.description || '',
      base_price: service.base_price || 0,
      pricing_type: service.pricing_type,
      category: service.category,
      subcategory: service.subcategory,
      active: service.active,
      background_check_required: service.background_check_required || false,
      ccq_rbq_required: service.ccq_rbq_required || false,
      risk_category: service.risk_category || 'low',
      provider: {
        id: provider.id,
        business_name: provider.business_name || 'Unknown Business',
        hourly_rate: provider.hourly_rate || 0,
        service_radius_km: provider.service_radius_km || 10,
        average_rating: provider.average_rating || 0,
        total_bookings: provider.total_bookings || 0,
        verified: provider.verified || false,
        verification_level: provider.verification_level || 'basic',
        background_check_verified: provider.background_check_verified || false,
        ccq_verified: provider.ccq_verified || false,
        rbq_verified: provider.rbq_verified || false,
        user: {
          full_name: provider.user.full_name,
          city: provider.user.city || 'Unknown',
          province: provider.user.province || 'Unknown'
        }
      }
    };
    
    setSelectedService(formattedService);
  };

  const handleBookingComplete = (bookingId: string) => {
    navigate('/booking-success');
  };

  const handleCancelBooking = () => {
    setSelectedService(null);
  };

  const handleSubmitReview = (review: { rating: number; comment: string; service: string }) => {
    // In a real app, this would submit to the database
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  };

  // Create provider data for map display
  const mapProvider = provider ? {
    id: parseInt(provider.id) || 0,
    name: provider.business_name || 'Unknown Business',
    service: provider.services?.[0]?.category || 'General Services',
    rating: provider.average_rating || 0,
    availability: 'Available',
    lat: 45.5017, // Default to Montreal coordinates
    lng: -73.5673,
    serviceRadius: provider.service_radius_km || 10
  } : null;

  if (selectedService) {
    return (
      <ServiceBookingWrapper
        service={selectedService}
        onBookingComplete={handleBookingComplete}
        onCancel={handleCancelBooking}
      />
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 font-medium">Loading provider profile...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!provider) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
          <div className="container mx-auto px-4 py-8">
            <Card className="fintech-card text-center py-16">
              <CardContent>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Provider Not Found</h2>
                <p className="text-gray-600 mb-6">The provider profile you're looking for doesn't exist.</p>
                <Button onClick={() => navigate('/services')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Browse All Services
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const sampleData = provider._sampleData;

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <ProviderProfileNavigation providerName={provider.business_name} />
          <ProviderProfileHeader provider={provider} />

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'services', label: 'Services & Booking' },
                  { id: 'gallery', label: 'Portfolio & Details' },
                  { id: 'reviews', label: 'Reviews & Ratings' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left side - Service Area Map */}
              <div className="lg:col-span-1">
                <Card className="fintech-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Area</h3>
                    <div className="h-96">
                      <MapSection
                        onCategorySelect={() => {}}
                        providers={mapProvider ? [mapProvider] : []}
                        hoveredProviderId={mapProvider?.id.toString()}
                        showCategories={false}
                        title="Service Area"
                      />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>Service Radius:</strong> {provider.service_radius_km}km</p>
                      <p><strong>Location:</strong> {provider.user.city}, {provider.user.province}</p>
                      {sampleData && (
                        <p><strong>Areas Served:</strong> {sampleData.serviceAreas.join(', ')}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right side - Services List */}
              <div className="lg:col-span-2">
                <ProviderServicesList 
                  services={provider.services || []}
                  providerHourlyRate={provider.hourly_rate}
                  onBookNow={handleBookNow}
                />
              </div>
            </div>
          )}

          {activeTab === 'gallery' && sampleData && (
            <ProviderServiceGallery
              services={sampleData.services}
              providerInfo={{
                businessName: sampleData.businessName,
                description: sampleData.description,
                phone: sampleData.phone,
                email: sampleData.email,
                serviceAreas: sampleData.serviceAreas,
                yearsExperience: sampleData.yearsExperience,
                responseTime: sampleData.responseTime,
                emergencyService: sampleData.emergencyService,
                certifications: sampleData.certifications,
                insurance: sampleData.insurance,
                backgroundCheck: sampleData.backgroundCheck
              }}
              onBookService={(serviceId) => {
                const service = sampleData.services.find(s => s.id === serviceId);
                if (service) {
                  handleBookNow({
                    id: service.id,
                    title: service.title,
                    description: service.description,
                    base_price: service.basePrice,
                    pricing_type: service.pricingType,
                    category: service.category,
                    subcategory: service.category,
                    active: true,
                    background_check_required: false,
                    ccq_rbq_required: false,
                    risk_category: 'low'
                  });
                }
              }}
            />
          )}

          {activeTab === 'reviews' && sampleData && (
            <ProviderReviewSystem
              providerId={provider.id}
              reviews={sampleData.reviews}
              averageRating={sampleData.averageRating}
              totalReviews={sampleData.totalReviews}
              onSubmitReview={handleSubmitReview}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PublicProviderProfile;
