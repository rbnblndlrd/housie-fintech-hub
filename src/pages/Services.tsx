import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, DollarSign, Search, Filter } from "lucide-react";
import { GoogleMap } from "@/components/GoogleMap";

export const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("montreal");

  const serviceCategories = [
    { id: "cleaning", name: "Cleaning", count: 234, color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
    { id: "lawn-snow", name: "Lawn/Snow", count: 156, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { id: "construction", name: "Construction", count: 89, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    { id: "wellness", name: "Wellness", count: 67, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    { id: "care-pets", name: "Care/Pets", count: 123, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" }
  ];

  const providers = [
    {
      id: 1,
      name: "Marie L.",
      service: "Ménage résidentiel",
      rating: 4.8,
      reviews: 47,
      hourlyRate: 20,
      location: "Montreal, QC",
      lat: 45.5017,
      lng: -73.5673,
      image: "/api/placeholder/60/60",
      availability: "Available",
      categories: ["cleaning"]
    },
    {
      id: 2,
      name: "Jean D.",
      service: "Nettoyage bureaux",
      rating: 4.9,
      reviews: 32,
      hourlyRate: 25,
      location: "Montreal, QC",
      lat: 45.5088,
      lng: -73.5878,
      image: "/api/placeholder/60/60",
      availability: "Busy",
      categories: ["cleaning"]
    },
    {
      id: 3,
      name: "Sophie M.",
      service: "Grand ménage",
      rating: 4.7,
      reviews: 28,
      hourlyRate: 22,
      location: "Montreal, QC",
      lat: 45.4947,
      lng: -73.5772,
      image: "/api/placeholder/60/60",
      availability: "Available",
      categories: ["cleaning"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-dark-primary dark:via-dark-secondary dark:to-darker">
      <Header />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-dark-text mb-2">Find Home Services</h1>
            <p className="text-gray-600 dark:text-dark-text-muted">Connect with verified professionals in your area</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 shadow-lg mb-8 border dark:border-gray-700">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-dark-accent dark:border-gray-600 dark:text-dark-text"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="dark:bg-dark-accent dark:border-gray-600 dark:text-dark-text">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="dark:bg-dark-secondary dark:border-gray-600">
                  <SelectItem value="all">All Categories</SelectItem>
                  {serviceCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="dark:bg-dark-accent dark:border-gray-600 dark:text-dark-text">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="dark:bg-dark-secondary dark:border-gray-600">
                  <SelectItem value="montreal">Montreal, QC</SelectItem>
                  <SelectItem value="toronto">Toronto, ON</SelectItem>
                  <SelectItem value="vancouver">Vancouver, BC</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service Categories */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-dark-secondary shadow-lg border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-dark-text">
                    <span>Service Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {serviceCategories.map(category => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-accent cursor-pointer transition-colors"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-dark-text-muted">{category.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Interactive Google Map */}
              <Card className="bg-white dark:bg-dark-secondary shadow-lg mt-6 border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-dark-text">Service Area Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoogleMap
                    center={{ lat: 45.5017, lng: -73.5673 }}
                    zoom={12}
                    className="h-64"
                    providers={providers}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Provider Listings */}
            <div className="lg:col-span-2 space-y-4">
              {providers.map(provider => (
                <Card key={provider.id} className="bg-white dark:bg-dark-secondary shadow-lg hover:shadow-xl transition-shadow border dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {provider.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-black dark:text-dark-text">{provider.name}</h3>
                            <p className="text-gray-600 dark:text-dark-text-secondary">{provider.service}</p>
                          </div>
                          <Badge 
                            variant={provider.availability === 'Available' ? 'default' : 'secondary'}
                            className={provider.availability === 'Available' ? 'bg-green-500' : 'bg-gray-500'}
                          >
                            {provider.availability}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium dark:text-dark-text">{provider.rating}</span>
                            <span className="text-gray-500 dark:text-dark-text-muted text-sm">({provider.reviews} reviews)</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-medium dark:text-dark-text">${provider.hourlyRate}/hour</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-500 dark:text-dark-text-muted text-sm">{provider.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-dark-text-muted">
                            Professional cleaning service with 5+ years experience
                          </p>
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
