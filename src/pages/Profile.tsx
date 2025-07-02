
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Calendar,
  Settings,
  Shield,
  Award
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userProfile = {
    name: user.user_metadata?.full_name || 'User',
    email: user.email || '',
    phone: '+1 (555) 123-4567',
    location: 'Montreal, QC',
    joinDate: 'January 2024',
    rating: 4.8,
    completedJobs: 127,
    isVerified: true,
    specialties: ['Plumbing', 'Electrical', 'General Repairs']
  };

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-16 pl-[188px] pr-[188px] pb-8">
          <div className="max-w-full">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                My Profile
              </h1>
              <p className="text-white/90 text-shadow">
                Manage your account information and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Overview */}
              <div className="lg:col-span-1">
                <Card className="fintech-card">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="mb-4">
                      <h2 className="text-xl font-bold mb-1">{userProfile.name}</h2>
                      {userProfile.isVerified && (
                        <Badge className="bg-green-100 text-green-800 mb-2">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified Provider
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{userProfile.email}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{userProfile.phone}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{userProfile.location}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {userProfile.joinDate}</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4 fintech-button-secondary">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="fintech-metric-card">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="text-2xl font-bold">{userProfile.rating}</div>
                      <div className="text-sm opacity-70">Average Rating</div>
                    </CardContent>
                  </Card>

                  <Card className="fintech-metric-card">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Award className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold">{userProfile.completedJobs}</div>
                      <div className="text-sm opacity-70">Jobs Completed</div>
                    </CardContent>
                  </Card>

                  <Card className="fintech-metric-card">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <User className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-sm opacity-70">Response Rate</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Specialties */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Specialties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="bg-blue-500/20 text-blue-800">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="fintech-inner-box flex items-center justify-between p-3">
                        <div>
                          <h4 className="font-medium">Plumbing Repair Completed</h4>
                          <p className="text-sm opacity-70">Downtown Montreal • 2 days ago</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      <div className="fintech-inner-box flex items-center justify-between p-3">
                        <div>
                          <h4 className="font-medium">Electrical Installation</h4>
                          <p className="text-sm opacity-70">Westmount • 1 week ago</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      <div className="fintech-inner-box flex items-center justify-between p-3">
                        <div>
                          <h4 className="font-medium">Kitchen Renovation</h4>
                          <p className="text-sm opacity-70">Plateau • 2 weeks ago</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
