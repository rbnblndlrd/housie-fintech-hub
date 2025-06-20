
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import ProfileNavigation from '@/components/ProfileNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Star, User, Search, Clock, Phone, MessageCircle, DollarSign, TrendingUp, Filter, CheckCircle, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';

// Mock data for provider dashboard
const mockProviderStats = {
  totalEarnings: 3240,
  thisMonthEarnings: 680,
  activeJobs: 4,
  completedJobs: 28,
  averageRating: 4.8,
  responseTime: '2h',
  completionRate: 95
};

const mockActiveJobs = [
  {
    id: '1',
    service_title: 'Nettoyage résidentiel',
    customer_name: 'Marie Leblanc',
    customer_phone: '514-555-0201',
    scheduled_date: '2024-01-25',
    scheduled_time: '10:00',
    status: 'confirmed',
    location: 'Montréal, QC',
    amount: 120,
    urgent: false
  },
  {
    id: '2',
    service_title: 'Réparation plomberie urgente',
    customer_name: 'Jean Tremblay',
    customer_phone: '514-555-0202',
    scheduled_date: '2024-01-24',
    scheduled_time: '14:00',
    status: 'in_progress',
    location: 'Laval, QC',
    amount: 250,
    urgent: true
  },
  {
    id: '3',
    service_title: 'Installation électrique',
    customer_name: 'Sophie Martin',
    customer_phone: '514-555-0203',
    scheduled_date: '2024-01-26',
    scheduled_time: '09:00',
    status: 'pending',
    location: 'Longueuil, QC',
    amount: 320,
    urgent: false
  },
  {
    id: '4',
    service_title: 'Jardinage',
    customer_name: 'Pierre Dubois',
    customer_phone: '514-555-0204',
    scheduled_date: '2024-01-27',
    scheduled_time: '13:30',
    status: 'confirmed',
    location: 'Brossard, QC',
    amount: 180,
    urgent: false
  }
];

const mockRecentCompletedJobs = [
  {
    id: '5',
    service_title: 'Nettoyage de bureau',
    customer_name: 'Entreprise ABC',
    completed_date: '2024-01-22',
    amount: 300,
    rating: 5,
    tip: 20
  },
  {
    id: '6',
    service_title: 'Réparation robinet',
    customer_name: 'Claire Dupont',
    completed_date: '2024-01-21',
    amount: 150,
    rating: 4,
    tip: 0
  },
  {
    id: '7',
    service_title: 'Peinture salon',
    customer_name: 'Marc Levesque',
    completed_date: '2024-01-20',
    amount: 450,
    rating: 5,
    tip: 50
  }
];

const ProviderDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500';
      case 'in_progress': return 'bg-orange-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'in_progress': return 'En Cours';
      case 'pending': return 'En Attente';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const filteredJobs = mockActiveJobs.filter(job => {
    const matchesSearch = job.service_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleQuickContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleUpdateStatus = (jobId: string, newStatus: string) => {
    console.log('Update job status:', jobId, 'to', newStatus);
    // TODO: Implement status update functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <ProfileNavigation profileType="provider" />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de Bord Prestataire
            </h1>
            <p className="text-gray-600">Gérez vos services et suivez vos performances</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenus Totaux</p>
                    <p className="text-2xl font-bold text-green-600">${mockProviderStats.totalEarnings}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ce Mois</p>
                    <p className="text-2xl font-bold text-blue-600">${mockProviderStats.thisMonthEarnings}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Jobs Actifs</p>
                    <p className="text-2xl font-bold text-orange-600">{mockProviderStats.activeJobs}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Note Moyenne</p>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold text-yellow-600">{mockProviderStats.averageRating}</p>
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - Active Jobs Management */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Jobs Section */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      Jobs Actifs
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className={`space-y-4 ${showFilters ? 'block' : 'hidden'}`}>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Rechercher par service ou client..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="pending">En Attente</SelectItem>
                          <SelectItem value="confirmed">Confirmé</SelectItem>
                          <SelectItem value="in_progress">En Cours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className={`p-4 rounded-lg border ${job.urgent ? 'border-red-300 bg-red-50' : 'bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              {job.service_title}
                              {job.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                            </h4>
                            <p className="text-sm text-gray-600">{job.customer_name}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(job.scheduled_date).toLocaleDateString('fr-FR')} à {job.scheduled_time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${job.amount}</p>
                          <Badge className={`${getStatusColor(job.status)} text-white text-xs`}>
                            {getStatusText(job.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickContact(job.customer_phone)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        {job.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(job.id, 'confirmed')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accepter
                          </Button>
                        )}
                        {job.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(job.id, 'in_progress')}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Commencer
                          </Button>
                        )}
                        {job.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(job.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Terminer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredJobs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucun job actif trouvé
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/provider-profile" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <User className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Button>
                  </Link>
                  <Link to="/analytics" className="block">
                    <Button variant="outline" className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                  <Link to="/calendar" className="block">
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendrier
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux de Completion</span>
                    <span className="font-semibold text-green-600">{mockProviderStats.completionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temps de Réponse</span>
                    <span className="font-semibold text-blue-600">{mockProviderStats.responseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Jobs Terminés</span>
                    <span className="font-semibold text-gray-900">{mockProviderStats.completedJobs}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Completed Jobs */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Jobs Récents Terminés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockRecentCompletedJobs.map((job) => (
                    <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm">{job.service_title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{job.customer_name}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{job.rating}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">${job.amount}</p>
                          {job.tip > 0 && (
                            <p className="text-xs text-green-600">+${job.tip} pourboire</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
