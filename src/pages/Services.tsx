
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, DollarSign, Search, Filter } from "lucide-react";

export const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("montreal");

  const serviceCategories = [
    { id: "cleaning", name: "Cleaning", count: 234, color: "bg-pink-100 text-pink-800" },
    { id: "lawn-snow", name: "Lawn/Snow", count: 156, color: "bg-green-100 text-green-800" },
    { id: "construction", name: "Construction", count: 89, color: "bg-orange-100 text-orange-800" },
    { id: "wellness", name: "Wellness", count: 67, color: "bg-purple-100 text-purple-800" },
    { id: "care-pets", name: "Care/Pets", count: 123, color: "bg-blue-100 text-blue-800" }
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
      image: "/api/placeholder/60/60",
      availability: "Available",
      categories: ["cleaning"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-orange-200">
      <Header />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">Find Home Services</h1>
            <p className="text-gray-600">Connect with verified professionals in your area</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {serviceCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
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
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>Service Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {serviceCategories.map(category => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="bg-white shadow-lg mt-6">
                <CardHeader>
                  <CardTitle>Service Area Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-blue-700 font-medium">Montreal, QC</p>
                      <p className="text-sm text-blue-600">Interactive map coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Provider Listings */}
            <div className="lg:col-span-2 space-y-4">
              {providers.map(provider => (
                <Card key={provider.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {provider.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-black">{provider.name}</h3>
                            <p className="text-gray-600">{provider.service}</p>
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
                            <span className="font-medium">{provider.rating}</span>
                            <span className="text-gray-500 text-sm">({provider.reviews} reviews)</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-medium">${provider.hourlyRate}/hour</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-500 text-sm">{provider.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
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
