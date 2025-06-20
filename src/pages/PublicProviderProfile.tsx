import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Star, MapPin, Clock, Shield, DollarSign, Phone, Mail, ArrowLeft, Home } from 'lucide-react';
import { Service } from '@/types/service';
import ServiceBookingWrapper from '@/components/ServiceBookingWrapper';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const PublicProviderProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: provider, isLoading } = useQuery({
    queryKey: ['public-provider', id],
    queryFn: async () => {
      if (!id) throw new Error('Provider ID is required');
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          user:users!inner(full_name, email, phone, city, province),
          services:services(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const handleBack = () => {
    // Try to go back in browser history, fallback to services page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/services');
    }
  };

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

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Back Navigation and Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button
                onClick={() => navigate('/services')}
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Browse More Providers
              </Button>
            </div>
            
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => navigate('/')}
                    className="cursor-pointer flex items-center gap-1"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => navigate('/services')}
                    className="cursor-pointer"
                  >
                    Find Services
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">
                    {provider.business_name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Provider Header */}
          <Card className="fintech-card mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg">
                  {provider.business_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PB'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.business_name}</h1>
                      <p className="text-lg text-gray-600 font-medium">{provider.user.full_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreamBadge variant={provider.verified ? 'success' : 'neutral'}>
                        {provider.verified ? 'Verified' : 'Unverified'}
                      </CreamBadge>
                      {provider.verification_level !== 'basic' && (
                        <CreamBadge variant="default">
                          {provider.verification_level === 'background_check' ? 'Background Check' : 'Professional License'}
                        </CreamBadge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{provider.average_rating.toFixed(1)}</span>
                      <span className="text-gray-500">({provider.total_bookings} bookings)</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{provider.hourly_rate}$/hour</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-600">{provider.user.city}, {provider.user.province}</span>
                      <span className="text-gray-400 text-sm">({provider.service_radius_km}km radius)</span>
                    </div>
                  </div>

                  {provider.description && (
                    <p className="text-gray-700 leading-relaxed">{provider.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Available Services</CardTitle>
            </CardHeader>
            <CardContent>
              {provider.services && provider.services.length > 0 ? (
                <div className="grid gap-6">
                  {provider.services.map((service: any) => (
                    <div key={service.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                          
                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-gray-900">
                                {service.pricing_type === 'hourly' 
                                  ? `${provider.hourly_rate}$/hour`
                                  : `${service.base_price}$ fixed`
                                }
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">+ 6% HOUSIE fee</span>
                            </div>
                          </div>

                          {(service.background_check_required || service.ccq_rbq_required) && (
                            <div className="flex items-center gap-2 mb-4">
                              <Shield className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-600 font-medium">
                                {service.background_check_required && 'Background Check Required'}
                                {service.background_check_required && service.ccq_rbq_required && ' • '}
                                {service.ccq_rbq_required && 'Professional License Required'}
                              </span>
                            </div>
                          )}
                        </div>

                        <Button 
                          onClick={() => handleBookNow(service)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No services available at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PublicProviderProfile;
