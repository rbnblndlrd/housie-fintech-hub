
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database, Users, Loader } from 'lucide-react';

const SampleProfileSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const sampleProfiles = [
    {
      username: 'marie-bouchard',
      email: 'marie.bouchard@example.com',
      full_name: 'Marie Bouchard',
      profile_image_url: '/lovable-uploads/8e4dab5f-fc1a-4bae-9e52-c88e60c0a67d.png',
      bio: 'Experienced plumber serving Montreal and surrounding areas. Licensed and insured with 15+ years experience.',
      location: 'Montreal, QC',
      profession: 'Licensed Plumber',
      company: 'Bouchard Plumbing Services',
      phone: '(514) 555-0123',
      network_connections_count: 47,
      total_reviews_received: 89,
      average_rating: 4.80,
      is_verified: true,
      primary_role: 'provider'
    },
    {
      username: 'jean-tremblay',
      email: 'jean.tremblay@example.com',
      full_name: 'Jean Tremblay',
      profile_image_url: '/lovable-uploads/89886ba9-5881-408e-93f3-d899470b94ad.png',
      bio: 'Fleet operations manager with expertise in logistics and vehicle coordination across Quebec.',
      location: 'Quebec City, QC',
      profession: 'Fleet Operations Manager',
      company: 'Transport Quebec Plus',
      phone: '(418) 555-0456',
      network_connections_count: 23,
      total_reviews_received: 12,
      average_rating: 4.60,
      is_verified: true,
      primary_role: 'fleet_manager'
    },
    {
      username: 'sophie-martin',
      email: 'sophie.martin@example.com',
      full_name: 'Sophie Martin',
      profile_image_url: '/lovable-uploads/aff65f57-e3a9-4005-b373-1377467a60c8.png',
      bio: 'Homeowner and busy professional looking for reliable home services. Love supporting local businesses!',
      location: 'Laval, QC',
      profession: 'Marketing Director',
      company: 'Digital Solutions Inc',
      phone: '(450) 555-0789',
      network_connections_count: 15,
      total_reviews_received: 8,
      average_rating: 4.90,
      is_verified: false,
      primary_role: 'customer'
    },
    {
      username: 'pierre-dubois',
      email: 'pierre.dubois@example.com',
      full_name: 'Pierre Dubois',
      profile_image_url: '/lovable-uploads/b77caab1-b357-4347-a5f2-47f8cc36c4c5.png',
      bio: 'Certified electrician and smart home specialist. Bringing modern technology to Quebec homes.',
      location: 'Gatineau, QC',
      profession: 'Certified Electrician',
      company: 'Smart Electric Solutions',
      phone: '(819) 555-0321',
      network_connections_count: 62,
      total_reviews_received: 134,
      average_rating: 4.70,
      is_verified: true,
      primary_role: 'provider'
    },
    {
      username: 'amelie-roy',
      email: 'amelie.roy@example.com',
      full_name: 'Amélie Roy',
      profile_image_url: '/lovable-uploads/cc04522b-5dd0-43c4-8cea-fd892168600e.png',
      bio: 'Property manager overseeing multiple residential complexes. Always looking for reliable contractors.',
      location: 'Sherbrooke, QC',
      profession: 'Property Manager',
      company: 'Roy Property Management',
      phone: '(819) 555-0654',
      network_connections_count: 38,
      total_reviews_received: 25,
      average_rating: 4.50,
      is_verified: true,
      primary_role: 'customer'
    }
  ];

  const seedSampleProfiles = async () => {
    setIsSeeding(true);
    try {
      // First, create auth users for each profile
      const authUsers = [];
      
      for (const profile of sampleProfiles) {
        // Check if user already exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('username', profile.username)
          .single();

        if (!existingProfile) {
          // Create dummy auth user (in a real app, these would be created through proper signup)
          const dummyUserId = crypto.randomUUID();
          
          // Insert into user_profiles table
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: dummyUserId,
              username: profile.username,
              full_name: profile.full_name,
              profile_image_url: profile.profile_image_url,
              bio: profile.bio,
              location: profile.location,
              profession: profile.profession,
              company: profile.company,
              phone: profile.phone,
              network_connections_count: profile.network_connections_count,
              total_reviews_received: profile.total_reviews_received,
              average_rating: profile.average_rating,
              is_verified: profile.is_verified
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
            continue;
          }

          // Insert role preferences
          const { error: roleError } = await supabase
            .from('user_role_preferences')
            .insert({
              user_id: dummyUserId,
              primary_role: profile.primary_role
            });

          if (roleError) {
            console.error('Error creating role preferences:', roleError);
          }

          authUsers.push({ username: profile.username, userId: dummyUserId });
        }
      }

      toast({
        title: "Sample profiles created!",
        description: `Successfully created ${authUsers.length} sample Quebec user profiles.`,
      });

    } catch (error) {
      console.error('Error seeding profiles:', error);
      toast({
        title: "Error",
        description: "Failed to create sample profiles. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Sample Quebec User Profiles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Create sample user profiles with Quebec locations, services, and network connections to demonstrate the social network features.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {sampleProfiles.map((profile) => (
            <div key={profile.username} className="p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src={profile.profile_image_url} 
                  alt={profile.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{profile.full_name}</div>
                  <div className="text-sm text-gray-600">@{profile.username}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>{profile.profession} - {profile.location}</div>
                <div className="flex items-center gap-4 mt-1">
                  <span>{profile.network_connections_count} connections</span>
                  <span>{profile.total_reviews_received} reviews</span>
                  <span>⭐ {profile.average_rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={seedSampleProfiles}
          disabled={isSeeding}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSeeding ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Creating Profiles...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Create Sample Profiles
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SampleProfileSeeder;
