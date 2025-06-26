
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Shield, Clock } from 'lucide-react';
import { sampleProviderProfiles } from '@/data/sampleProviderProfiles';

const FeaturedProviders = () => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Service Providers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover trusted, verified professionals in your area ready to help with your next project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProviderProfiles.map((provider) => (
            <Link
              key={provider.id}
              to={`/provider/${provider.id}`}
              className="block transition-transform hover:scale-105"
            >
              <Card className="fintech-card h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  {/* Provider Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {provider.businessName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {provider.businessName}
                      </h3>
                      <p className="text-sm text-gray-600">{provider.fullName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(Math.round(provider.averageRating))}
                        <span className="text-sm text-gray-600 ml-1">
                          {provider.averageRating} ({provider.totalReviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.serviceAreas.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Response: {provider.responseTime}</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                      {provider.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {provider.services.slice(0, 2).map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service.category}
                        </Badge>
                      ))}
                      {provider.services.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.services.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {provider.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {provider.emergencyService && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          24/7
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${provider.hourlyRate}/hr
                      </div>
                      <div className="text-xs text-gray-500">
                        {provider.yearsExperience} years exp.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            View All Providers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProviders;
