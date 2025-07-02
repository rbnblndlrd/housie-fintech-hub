import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalProfileSection from '@/components/profile/PersonalProfileSection';
import ProviderProfileSection from '@/components/profile/ProviderProfileSection';
import BusinessProfileSection from '@/components/profile/BusinessProfileSection';
import SettingsSection from '@/components/profile/SettingsSection';
import { 
  User, 
  Briefcase,
  Building,
  Settings
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);

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

  const handleRoleToggle = async () => {
    const newRole = currentRole === 'customer' ? 'provider' : 'customer';
    await switchRole(newRole);
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

            {/* Profile Navigation */}
            <div className="mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
                  <TabsTrigger value="personal" className="data-[state=active]:bg-white/50 text-white data-[state=active]:text-gray-900">
                    <User className="h-4 w-4 mr-2" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="provider" className="data-[state=active]:bg-white/50 text-white data-[state=active]:text-gray-900">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Provider
                  </TabsTrigger>
                  <TabsTrigger value="business" className="data-[state=active]:bg-white/50 text-white data-[state=active]:text-gray-900">
                    <Building className="h-4 w-4 mr-2" />
                    Business
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-white/50 text-white data-[state=active]:text-gray-900">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  {/* Personal Profile Tab */}
                  <TabsContent value="personal" className="space-y-6">
                    <PersonalProfileSection 
                      userProfile={userProfile}
                      editing={editing}
                      setEditing={setEditing}
                      currentRole={currentRole}
                      onRoleToggle={handleRoleToggle}
                    />
                  </TabsContent>

                  {/* Provider Profile Tab */}
                  <TabsContent value="provider" className="space-y-6">
                    <ProviderProfileSection userProfile={userProfile} />
                  </TabsContent>

                  {/* Business Profile Tab */}
                  <TabsContent value="business" className="space-y-6">
                    <BusinessProfileSection 
                      editing={editing}
                      setEditing={setEditing}
                    />
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6">
                    <SettingsSection />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;