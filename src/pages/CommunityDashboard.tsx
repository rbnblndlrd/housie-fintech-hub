import React, { useState } from 'react';
import VideoBackground from '@/components/common/VideoBackground';
import CommunityNavigation from '@/components/dashboard/CommunityNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Users, 
  Trophy, 
  BarChart3,
  Heart,
  Star,
  MessageCircle,
  Award,
  Crown,
  Briefcase,
  MapPin,
  Network,
  Zap
} from 'lucide-react';

const CommunityDashboard = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const communityStats = [
    {
      title: "Network Connections",
      value: "127",
      change: "+23",
      icon: Users,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Community Points",
      value: "2,450",
      change: "+180",
      icon: Trophy,
      color: "from-yellow-600 to-orange-600"
    },
    {
      title: "Crew Memberships",
      value: "3",
      change: "+1",
      icon: Network,
      color: "from-purple-600 to-violet-600"
    },
    {
      title: "Local Rank",
      value: "#12",
      change: "+3",
      icon: Award,
      color: "from-green-600 to-emerald-600"
    }
  ];

  const nearbyCrews = [
    {
      name: "Montreal Cleaners Unite",
      members: 45,
      category: "Cleaning Services",
      distance: "2.3km",
      rating: 4.8
    },
    {
      name: "Handyman Heroes",
      members: 32,
      category: "Home Repair",
      distance: "3.1km",
      rating: 4.6
    },
    {
      name: "Garden Guardians",
      members: 28,
      category: "Landscaping",
      distance: "1.8km",
      rating: 4.9
    }
  ];

  const achievements = [
    {
      title: "First Connection",
      description: "Made your first network connection",
      earned: true,
      rarity: "Common"
    },
    {
      title: "Community Helper",
      description: "Helped 50+ community members",
      earned: true,
      rarity: "Rare"
    },
    {
      title: "Local Legend",
      description: "Top 10 in your neighborhood",
      earned: false,
      progress: 75,
      rarity: "Epic"
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        {/* Community Navigation - Left Side - Desktop Only */}
        <div className="hidden md:block fixed top-80 left-12 z-40 w-52">
          <CommunityNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="pt-20 px-4 pb-8 md:pl-[280px]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                Community Dashboard
              </h1>
              <p className="text-white/90 drop-shadow-md">
                Connect, collaborate, and grow with the HOUSIE community
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {communityStats.map((stat, index) => (
                <Card key={index} className="fintech-metric-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium opacity-80 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change} this month</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Content Based on Active Tab */}
            {activeTab === 'discover' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Nearby Crews */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="h-5 w-5" />
                        Nearby Crews & Collectives
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {nearbyCrews.map((crew, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{crew.name}</h3>
                            <p className="text-sm opacity-70">{crew.category} • {crew.members} members</p>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-3 w-3 opacity-60" />
                              <span className="text-xs opacity-60">{crew.distance} away</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs">{crew.rating}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Join</Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Local Scene */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Local Scene Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50/50 rounded-lg">
                          <p className="font-medium">🎉 New Cleaning Crew Formed</p>
                          <p className="text-sm opacity-70">Downtown Montreal • 2 hours ago</p>
                        </div>
                        <div className="p-4 bg-green-50/50 rounded-lg">
                          <p className="font-medium">⚡ High Demand Alert</p>
                          <p className="text-sm opacity-70">Handyman services • Plateau area</p>
                        </div>
                        <div className="p-4 bg-purple-50/50 rounded-lg">
                          <p className="font-medium">🏆 Weekly Leaderboard</p>
                          <p className="text-sm opacity-70">Top providers this week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </div>
            )}

            {activeTab === 'network' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* My Connections */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        My Network (127 connections)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Heart className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Sarah M.</p>
                              <p className="text-sm opacity-70">Cleaning Services</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Connected</Badge>
                        </div>
                        <div className="text-center pt-4">
                          <Button variant="outline" className="w-full">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            View All Connections
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Relationships */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Team Relationships
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Collaboration Score</p>
                            <span className="text-lg font-bold">8.4/10</span>
                          </div>
                          <Progress value={84} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-green-50/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">23</p>
                            <p className="text-sm opacity-70">Active Teams</p>
                          </div>
                          <div className="p-3 bg-blue-50/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">156</p>
                            <p className="text-sm opacity-70">Joint Projects</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </div>
            )}

            {activeTab === 'recognition' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Achievements */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Achievements & Badges
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {achievements.map((achievement, index) => (
                        <div key={index} className={`p-4 rounded-lg ${
                          achievement.earned ? 'bg-green-50/50' : 'bg-gray-50/50'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Crown className={`h-4 w-4 ${
                                achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                              }`} />
                              <p className="font-medium">{achievement.title}</p>
                            </div>
                            <Badge variant={
                              achievement.rarity === 'Epic' ? 'default' : 
                              achievement.rarity === 'Rare' ? 'secondary' : 'outline'
                            }>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm opacity-70 mb-2">{achievement.description}</p>
                          {!achievement.earned && achievement.progress && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <Progress value={achievement.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Shop Points */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        HOUSIE Shop Points
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                          <p className="text-4xl font-bold mb-2">1,847</p>
                          <p className="opacity-90">Available Shop Points</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50/50 rounded-lg text-center">
                            <p className="text-lg font-bold text-blue-600">+180</p>
                            <p className="text-sm opacity-70">This Week</p>
                          </div>
                          <div className="p-3 bg-green-50/50 rounded-lg text-center">
                            <p className="text-lg font-bold text-green-600">4.2x</p>
                            <p className="text-sm opacity-70">Multiplier</p>
                          </div>
                        </div>
                        <Button className="w-full">
                          <Trophy className="h-4 w-4 mr-2" />
                          Visit HOUSIE Shop
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              </div>
            )}

            {activeTab === 'social' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Community Impact */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Community Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">4.8</p>
                            <p className="text-sm opacity-70">Community Rating</p>
                          </div>
                          <div className="p-4 bg-green-50/50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">89</p>
                            <p className="text-sm opacity-70">Helped Neighbors</p>
                          </div>
                        </div>
                        <div className="p-4 bg-purple-50/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Local Influence</p>
                            <span className="text-lg font-bold">76%</span>
                          </div>
                          <Progress value={76} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Collaboration Metrics */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="h-5 w-5" />
                        Collaboration Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-3 bg-yellow-50/50 rounded-lg text-center">
                            <p className="text-lg font-bold text-yellow-600">12</p>
                            <p className="text-xs opacity-70">Referrals</p>
                          </div>
                          <div className="p-3 bg-purple-50/50 rounded-lg text-center">
                            <p className="text-lg font-bold text-purple-600">34</p>
                            <p className="text-xs opacity-70">Collabs</p>
                          </div>
                          <div className="p-3 bg-green-50/50 rounded-lg text-center">
                            <p className="text-lg font-bold text-green-600">98%</p>
                            <p className="text-xs opacity-70">Success Rate</p>
                          </div>
                        </div>
                        <div className="h-32 flex items-center justify-center bg-muted/20 rounded-lg">
                          <p className="opacity-70">Collaboration trends chart</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityDashboard;