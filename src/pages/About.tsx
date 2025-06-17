
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Search, Calendar, Shield, Star, Phone, Mail, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">À Propos de HOUSIE</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La plateforme qui connecte les clients avec des prestataires de services de confiance 
            pour tous vos besoins domestiques et professionnels.
          </p>
        </div>

        {/* How It Works Section */}
        <Card className="bg-white shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Search className="h-6 w-6 text-blue-600" />
              Comment Ça Marche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Recherchez</h3>
                <p className="text-sm text-gray-600">
                  Trouvez le service dont vous avez besoin parmi notre large gamme de prestataires qualifiés.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Réservez</h3>
                <p className="text-sm text-gray-600">
                  Choisissez votre créneau horaire et confirmez votre réservation en quelques clics.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Profitez</h3>
                <p className="text-sm text-gray-600">
                  Recevez un service de qualité et évaluez votre expérience pour aider la communauté.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* For Customers Section */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-blue-600" />
                Pour les Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Accès à des centaines de prestataires vérifiés dans votre région</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Réservation en ligne simple et rapide</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Évaluations et avis clients pour vous aider à choisir</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Paiement sécurisé et service client réactif</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Suivi de vos réservations depuis votre tableau de bord</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/services">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Découvrir les Services
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* For Service Providers Section */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5 text-green-600" />
                Pour les Prestataires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Développez votre clientèle avec notre plateforme</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Gestion simplifiée de vos rendez-vous et réservations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Outils d'analyse pour optimiser votre activité</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Paiements sécurisés et versements rapides</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Support dédié aux professionnels</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/auth">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Devenir Prestataire
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Us Section */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Phone className="h-6 w-6 text-purple-600" />
              Nous Contacter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Téléphone</h3>
                <p className="text-gray-600">(514) 123-HOUSIE</p>
                <p className="text-gray-600">(514) 123-4687</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@housie.com</p>
                <p className="text-gray-600">info@housie.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Adresse</h3>
                <p className="text-gray-600">123 Rue Principal</p>
                <p className="text-gray-600">Montréal, QC H1A 1A1</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Une question ? Une suggestion ? N'hésitez pas à nous contacter !
              </p>
              <p className="text-sm text-gray-500">
                Notre équipe est disponible du lundi au vendredi, de 9h à 18h.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="outline" className="px-8">
              Retour à l'Accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
