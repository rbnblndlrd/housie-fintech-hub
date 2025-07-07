import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Briefcase, 
  MapPin,
  Save,
  Settings,
  CheckCircle,
  Crown,
  Phone,
  Mail,
  Clock,
  Wrench,
  Sparkles,
  Home,
  Trees,
  Heart,
  Zap,
  Music,
  Truck,
  Trophy
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import ProfileTabNavigation, { ProfileTab } from './ProfileTabNavigation';

interface ProviderTabProps {
  profile: UnifiedUserProfile;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const ProviderTab: React.FC<ProviderTabProps> = ({ profile, activeTab, onTabChange }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [serviceArea, setServiceArea] = useState([25]); // 5km to 50km range
  const [allowDirectContact, setAllowDirectContact] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);

  // Guild Wars 2 style progression system
  const serviceProgressions = [
    {
      id: 'personal_wellness',
      name: 'Personal Wellness',
      emoji: '💆',
      tagline: 'The Knot Busters',
      icon: Heart,
      ranks: [
        { title: 'Pressure Point Master', requirement: 50, timeEstimate: '1-3 months' },
        { title: 'The Stress Eraser', requirement: 100, timeEstimate: '3-6 months' },
        { title: 'Mobile Miracle Worker', requirement: 200, timeEstimate: '6-12 months' },
        { title: 'Insurance Navigator', requirement: 300, timeEstimate: '9-18 months' },
        { title: 'The Recovery Coach', requirement: 400, timeEstimate: '12-24 months' },
        { title: 'The Knot Buster', requirement: 500, timeEstimate: '6 months to 3+ years', isMaster: true }
      ]
    },
    {
      id: 'cleaning_services',
      name: 'Cleaning Services',
      emoji: '🧹',
      tagline: 'The Spotless Squad',
      icon: Sparkles,
      ranks: [
        { title: 'Speed Cleaner', requirement: 25, timeEstimate: '1-2 months' },
        { title: 'The Organizer', requirement: 75, timeEstimate: '3-6 months' },
        { title: 'Chemical Connoisseur', requirement: 150, timeEstimate: '6-12 months' },
        { title: 'Stain Slayer', requirement: 250, timeEstimate: '1-2 years' },
        { title: 'Move-Out Magician', requirement: 350, timeEstimate: '2-3 years' },
        { title: 'SPOTLESS', requirement: 500, timeEstimate: '2-4 years', isMaster: true }
      ]
    },
    {
      id: 'exterior_grounds',
      name: 'Exterior & Grounds',
      emoji: '🌿',
      tagline: 'The Outdoor Crew',
      icon: Trees,
      ranks: [
        { title: 'Weed Warrior', requirement: 30, timeEstimate: '1-2 months' },
        { title: 'Pressure Perfect', requirement: 75, timeEstimate: '3-6 months' },
        { title: 'The Landscaper', requirement: 150, timeEstimate: '6-12 months' },
        { title: 'Risk Assessor', requirement: 250, timeEstimate: '1-2 years' },
        { title: 'Drought Defier', requirement: 350, timeEstimate: '2-3 years' },
        { title: 'Woodpecker', requirement: 500, timeEstimate: '2-4 years', isMaster: true }
      ]
    },
    {
      id: 'pet_care',
      name: 'Pet Care Services',
      emoji: '🐕',
      tagline: 'The Paw Patrol',
      icon: Heart,
      ranks: [
        { title: 'The Pet Whisperer', requirement: 50, timeEstimate: '2-4 months' },
        { title: 'Animal Lover', requirement: 100, timeEstimate: '4-8 months' },
        { title: 'Ruff Around the Edges', requirement: 200, timeEstimate: '8-16 months' },
        { title: 'Paws & Reflect', requirement: 300, timeEstimate: '1-2 years' },
        { title: 'Pack Leader', requirement: 400, timeEstimate: '1.5-3 years' },
        { title: 'The Alpha', requirement: 500, timeEstimate: '2-4 years', isMaster: true }
      ]
    },
    {
      id: 'appliance_tech_repair',
      name: 'Appliance & Tech Repair',
      emoji: '🔧',
      tagline: 'The Fix-It Phantoms',
      icon: Zap,
      ranks: [
        { title: 'Brand Connoisseur', requirement: 25, timeEstimate: '1-3 months' },
        { title: 'Diagnostic Prodigy', requirement: 75, timeEstimate: '3-9 months' },
        { title: 'Circuit Expert', requirement: 150, timeEstimate: '6-18 months' },
        { title: 'Warranty Wizard', requirement: 250, timeEstimate: '1-2.5 years' },
        { title: 'The Specialist', requirement: 350, timeEstimate: '1.5-3.5 years' },
        { title: 'Technomancer', requirement: 500, timeEstimate: '2-5 years', isMaster: true }
      ]
    },
    {
      id: 'event_services',
      name: 'Event Services',
      emoji: '🎪',
      tagline: 'The Stage Commanders',
      icon: Music,
      ranks: [
        { title: 'Load-In Legend', requirement: 15, timeEstimate: '2-6 months' },
        { title: 'Time Crunch Hero', requirement: 40, timeEstimate: '6-16 months' },
        { title: 'Sound Sage', requirement: 75, timeEstimate: '1-2.5 years' },
        { title: 'Stage Architect', requirement: 125, timeEstimate: '1.5-4 years' },
        { title: 'Party Coordinator', requirement: 175, timeEstimate: '2-5 years' },
        { title: 'Showtime', requirement: 250, timeEstimate: '3-7 years', isMaster: true }
      ]
    },
    {
      id: 'moving_delivery',
      name: 'Moving & Delivery',
      emoji: '🚚',
      tagline: 'The Heavy Lifters',
      icon: Truck,
      ranks: [
        { title: 'Tetris Apprentice', requirement: 25, timeEstimate: '1-3 months' },
        { title: 'Assembly Expert', requirement: 75, timeEstimate: '3-9 months' },
        { title: 'Relocator', requirement: 150, timeEstimate: '6-18 months' },
        { title: 'Road Warrior', requirement: 250, timeEstimate: '1-2.5 years' },
        { title: 'Time Saver', requirement: 350, timeEstimate: '1.5-3.5 years' },
        { title: 'Handler', requirement: 500, timeEstimate: '2-5 years', isMaster: true }
      ]
    }
  ];

  // Mock user's current job counts for different services (replace with real data)
  const userJobCounts = {
    personal_wellness: 127,
    cleaning_services: 89,
    exterior_grounds: 12,
    pet_care: 0,
    appliance_tech_repair: 45,
    event_services: 3,
    moving_delivery: 67
  };

  // User's active specialties (these should show first)
  const userSpecialties = ['cleaning_services', 'personal_wellness', 'appliance_tech_repair'];

  const getRankStatus = (progression: any, userCount: number) => {
    let currentRankIndex = -1;
    let nextRankIndex = 0;
    
    for (let i = 0; i < progression.ranks.length; i++) {
      if (userCount >= progression.ranks[i].requirement) {
        currentRankIndex = i;
      } else {
        nextRankIndex = i;
        break;
      }
    }
    
    return { currentRankIndex, nextRankIndex };
  };

  const getProgressPercentage = (progression: any, userCount: number) => {
    const { currentRankIndex, nextRankIndex } = getRankStatus(progression, userCount);
    
    if (currentRankIndex === progression.ranks.length - 1) return 100; // Max rank achieved
    
    const currentReq = currentRankIndex >= 0 ? progression.ranks[currentRankIndex].requirement : 0;
    const nextReq = progression.ranks[nextRankIndex].requirement;
    const progress = Math.min(100, ((userCount - currentReq) / (nextReq - currentReq)) * 100);
    
    return Math.max(0, progress);
  };

  // Sort progressions: user specialties first, then others
  const sortedProgressions = [
    ...serviceProgressions.filter(p => userSpecialties.includes(p.id)),
    ...serviceProgressions.filter(p => !userSpecialties.includes(p.id))
  ];

  const handleSave = () => {
    toast({
      title: "Provider Settings Updated",
      description: "Your professional settings have been updated successfully.",
    });
    setIsEditing(false);
  };

  const getServiceAreaText = (value: number) => {
    if (value <= 10) return `${value}km - Local`;
    if (value <= 30) return `${value}km - Regional`;
    return value >= 50 ? 'Montreal Wide' : `${value}km - Extended`;
  };

  return (
    <div className="space-y-6">
      {/* Professional Settings */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Settings
            {profile.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
          </CardTitle>
          {/* Tab Navigation inside the card */}
          <div className="mt-4">
            <ProfileTabNavigation
              activeTab={activeTab}
              onTabChange={onTabChange}
              profile={profile}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
            <div>
              <p className="font-medium text-green-800">Provider Status</p>
              <p className="text-sm text-green-600">
                {profile.verified ? 'Verified Professional' : 'Pending Verification'}
              </p>
            </div>
            <Badge variant={profile.verified ? "default" : "secondary"}>
              {profile.verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Business Name</Label>
              <Input
                value={profile.business_name || ''}
                placeholder="Enter business name"
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label>Hourly Rate</Label>
              <Input
                value={`$${profile.hourly_rate || 45}/hr`}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label>Specialties</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {userSpecialties.map((specialtyId) => {
                const progression = serviceProgressions.find(p => p.id === specialtyId);
                return progression ? (
                  <Badge key={specialtyId} variant="outline" className="flex items-center gap-1">
                    <progression.icon className="h-3 w-3" />
                    {progression.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Show Availability</p>
                  <p className="text-sm text-muted-foreground">Display work schedule</p>
                </div>
              </div>
              <Switch
                checked={showAvailability}
                onCheckedChange={setShowAvailability}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="w-full"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Area Slider */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Area
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">
                Coverage: {getServiceAreaText(serviceArea[0])}
              </Label>
              <div className="mt-2">
                <Slider
                  value={serviceArea}
                  onValueChange={setServiceArea}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5km Local</span>
                <span>25km Regional</span>
                <span>50km+ Montreal</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-blue-50/50 rounded">
                <span className="text-blue-600 font-medium">5-10km</span>
                <p className="text-blue-600">Local</p>
              </div>
              <div className="text-center p-2 bg-green-50/50 rounded">
                <span className="text-green-600 font-medium">15-30km</span>
                <p className="text-green-600">Regional</p>
              </div>
              <div className="text-center p-2 bg-purple-50/50 rounded">
                <span className="text-purple-600 font-medium">35km+</span>
                <p className="text-purple-600">Montreal</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HOUSIE Prestige Title Progressions */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            🏆 HOUSIE Prestige Title Progressions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedProgressions.map((progression) => {
              const userCount = userJobCounts[progression.id as keyof typeof userJobCounts] || 0;
              const { currentRankIndex, nextRankIndex } = getRankStatus(progression, userCount);
              const progressPercentage = getProgressPercentage(progression, userCount);
              const IconComponent = progression.icon;
              
              return (
                <div key={progression.id} className="space-y-3">
                  {/* Service Header */}
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <span className="text-2xl">{progression.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <h4 className="font-semibold">{progression.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{progression.tagline}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{userCount}</p>
                      <p className="text-xs text-muted-foreground">jobs</p>
                    </div>
                  </div>

                  {/* Current Progress */}
                  {userCount > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Current Progress: {currentRankIndex >= 0 ? progression.ranks[currentRankIndex].title : 'Not started'}
                          {currentRankIndex < progression.ranks.length - 1 && (
                            <> → {progression.ranks[nextRankIndex].title}</>
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      {currentRankIndex < progression.ranks.length - 1 && (
                        <p className="text-xs text-muted-foreground">
                          {progression.ranks[nextRankIndex].requirement - userCount} more jobs to reach {progression.ranks[nextRankIndex].title}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Rank List */}
                  <div className="grid gap-2">
                    {progression.ranks.map((rank, rankIndex) => {
                      const isEarned = userCount >= rank.requirement;
                      const isInProgress = !isEarned && rankIndex === nextRankIndex && userCount > 0;
                      const isLocked = !isEarned && !isInProgress;
                      
                      return (
                        <div
                          key={rankIndex}
                          className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                            isEarned 
                              ? 'bg-green-50/50 text-green-800' 
                              : isInProgress 
                                ? 'bg-blue-50/50 text-blue-800'
                                : 'bg-muted/20 text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isEarned && <span>✅</span>}
                            {isInProgress && <span>🔄</span>}
                            {isLocked && <span>🔒</span>}
                            {rank.isMaster && <Trophy className="h-4 w-4 text-yellow-600" />}
                          </div>
                          
                          <div className="flex-1">
                            <span className="font-medium">{rank.title}</span>
                            {rank.isMaster && <span className="ml-1">🏆</span>}
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium">{rank.requirement} jobs</div>
                            <div className="text-xs text-muted-foreground">{rank.timeEstimate}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Professional Contact Options */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Professional Contact Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Direct Contact</p>
                <p className="text-sm text-muted-foreground">Allow customers to contact directly</p>
              </div>
            </div>
            <Switch
              checked={allowDirectContact}
              onCheckedChange={setAllowDirectContact}
              disabled={!isEditing}
            />
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Business Email</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {profile.full_name ? `${profile.full_name.toLowerCase().replace(' ', '.')}@business.com` : 'Not set'}
            </p>
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Business Phone</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {profile.phone || 'Not set'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderTab;