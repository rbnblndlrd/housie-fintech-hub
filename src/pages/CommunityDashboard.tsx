import React, { useState } from 'react';
import VideoBackground from '@/components/common/VideoBackground';
import CommunityNavigation from '@/components/dashboard/CommunityNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Zap,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Wrench,
  Sparkles,
  UserCheck,
  Clock,
  Target,
  Users2
} from 'lucide-react';

const CommunityDashboard = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    rankProgressions: false,
    behavioralAchievements: false,
    platformMilestones: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const communityStats = [
    {
      title: "Network Connections",
      value: "127",
      change: "+23",
      icon: Users,
      color: "from-blue-600 to-cyan-600",
      modalKey: "connections"
    },
    {
      title: "Community Points",
      value: "2,450",
      change: "+180",
      icon: Trophy,
      color: "from-yellow-600 to-orange-600",
      modalKey: "points"
    },
    {
      title: "Memberships",
      value: "3",
      change: "+1",
      icon: Network,
      color: "from-purple-600 to-violet-600",
      modalKey: "memberships"
    },
    {
      title: "Current Rank",
      value: "Technomancer ⚡",
      change: "+3 levels",
      icon: Award,
      color: "from-green-600 to-emerald-600",
      modalKey: "rank"
    }
  ];

  const connections = [
    { name: "Sarah M.", service: "Cleaning Services", status: "Active", lastActivity: "2 hours ago", avatar: "SM" },
    { name: "Mike T.", service: "Handyman", status: "Active", lastActivity: "1 day ago", avatar: "MT" },
    { name: "Lisa K.", service: "Landscaping", status: "Connected", lastActivity: "3 days ago", avatar: "LK" },
    { name: "Alex R.", service: "Plumbing", status: "Active", lastActivity: "5 hours ago", avatar: "AR" }
  ];

  const shopItems = [
    { name: "Premium Badge", cost: 500, type: "badge", description: "Stand out with premium styling" },
    { name: "2x Points Boost", cost: 1000, type: "boost", description: "Double points for 7 days" },
    { name: "Dark Theme", cost: 300, type: "theme", description: "Exclusive dark mode theme" },
    { name: "Gold Crown", cost: 2000, type: "badge", description: "Ultimate status symbol" }
  ];

  const memberships = [
    { name: "Montreal Cleaners Unite", role: "Member", members: 45, lastActivity: "Active", type: "crew" },
    { name: "Home Service Collective", role: "Coordinator", members: 128, lastActivity: "2 hours ago", type: "collective" },
    { name: "Quality First Alliance", role: "Member", members: 67, lastActivity: "1 day ago", type: "crew" }
  ];

  const rankProgress = [
    { category: "Cleaning", current: "Expert", progress: 85, next: "Master" },
    { category: "Handyman", current: "Advanced", progress: 65, next: "Expert" },
    { category: "Landscaping", current: "Intermediate", progress: 40, next: "Advanced" },
    { category: "Overall", current: "Technomancer", progress: 75, next: "Grandmaster" }
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
                <Card 
                  key={index} 
                  className="fintech-metric-card hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => setOpenModal(stat.modalKey)}
                >
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
                <div className="space-y-6">
                  {/* 1. Recogs Breakdown Section */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        🏆 Current Recogs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Quality</span>
                            <span className="font-bold text-blue-600">23 recogs</span>
                          </div>
                          <Progress value={76} className="h-2 mb-1" />
                          <p className="text-xs opacity-70">7 more to reach next milestone (30)</p>
                        </div>
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Reliability</span>
                            <span className="font-bold text-green-600">18 recogs</span>
                          </div>
                          <Progress value={60} className="h-2 mb-1" />
                          <p className="text-xs opacity-70">12 more to reach next milestone (30)</p>
                        </div>
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Courtesy</span>
                            <span className="font-bold text-purple-600">31 recogs</span>
                          </div>
                          <Progress value={100} className="h-2 mb-1" />
                          <p className="text-xs opacity-70">Milestone reached! Next: 50</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 2. Point Spread Gap Titles */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        ⚖️ Balanced Excellence Progression
                      </CardTitle>
                      <p className="text-sm opacity-70 mt-1">Current: Working toward Balanced Professional</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Balanced Professional</span>
                          <Badge variant="outline">🔒 Locked</Badge>
                        </div>
                        <p className="text-sm opacity-70 mt-1">15+ all categories, max 10 point gap</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Well-Rounded Expert</span>
                          <Badge variant="outline">🔒 Locked</Badge>
                        </div>
                        <p className="text-sm opacity-70 mt-1">30+ all categories, max 8 point gap</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Source of Excellence</span>
                          <Badge variant="outline">🔒 Locked</Badge>
                        </div>
                        <p className="text-sm opacity-70 mt-1">50+ all categories, max 6 point gap</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Master of All Trades</span>
                          <Badge variant="outline">🔒 Locked</Badge>
                        </div>
                        <p className="text-sm opacity-70 mt-1">75+ all categories, max 4 point gap</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Origin of Perfection</span>
                          <Badge variant="outline">🔒 Locked</Badge>
                        </div>
                        <p className="text-sm opacity-70 mt-1">100+ all categories, max 3 point gap</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 3. Behavioral Achievements */}
                    <Card className="fintech-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          ⚡ Professional Achievements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">✅ Quality Collector</span>
                            <Badge variant="default">Complete</Badge>
                          </div>
                          <p className="text-sm opacity-70">23/100 Quality recogs</p>
                          <Progress value={23} className="h-2 mt-2" />
                        </div>
                        <div className="p-4 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">🔄 Lightning Response</span>
                            <Badge variant="outline">In Progress</Badge>
                          </div>
                          <p className="text-sm opacity-70">Response time: 4 min avg, need &lt;2 min</p>
                          <Progress value={50} className="h-2 mt-2" />
                        </div>
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">🔒 Same Day Savior</span>
                            <Badge variant="outline">Locked</Badge>
                          </div>
                          <p className="text-sm opacity-70">12/50 same-day bookings</p>
                          <Progress value={24} className="h-2 mt-2" />
                        </div>
                        <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">✅ Network Navigator</span>
                            <Badge variant="default">Complete</Badge>
                          </div>
                          <p className="text-sm opacity-70">127/100 connections</p>
                          <Progress value={100} className="h-2 mt-2" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* 4. Meta-Achievement Progress */}
                    <Card className="fintech-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Crown className="h-5 w-5" />
                          👑 Kind of a Big Deal Progression
                        </CardTitle>
                        <p className="text-sm opacity-70 mt-1">Current Titles Earned: 3/5 needed</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span className="font-medium">Technomancer</span>
                          </div>
                          <p className="text-sm opacity-70 ml-6">Rank achievement</p>
                        </div>
                        <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span className="font-medium">Quality Collector</span>
                          </div>
                          <p className="text-sm opacity-70 ml-6">Recognition achievement</p>
                        </div>
                        <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span className="font-medium">Network Navigator</span>
                          </div>
                          <p className="text-sm opacity-70 ml-6">Behavioral achievement</p>
                        </div>
                        <div className="p-4 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-600">🔄</span>
                            <span className="font-medium">Working on Lightning Response</span>
                          </div>
                          <p className="text-sm opacity-70 ml-6">Speed achievement in progress</p>
                        </div>
                        <div className="p-4 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-600">🔄</span>
                            <span className="font-medium">Working on Balanced Professional</span>
                          </div>
                          <p className="text-sm opacity-70 ml-6">Balance achievement in progress</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Professional Rank Progressions */}
                  <Collapsible open={!collapsedSections.rankProgressions} onOpenChange={() => toggleSection('rankProgressions')}>
                    <CollapsibleTrigger asChild>
                      <Card className="fintech-card cursor-pointer hover:bg-muted/5">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-5 w-5" />
                              🏆 Professional Rank Progressions
                            </div>
                            {collapsedSections.rankProgressions ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      {/* Appliance & Tech Repair */}
                      <Card className="fintech-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5" />
                            🔧 Appliance & Tech Repair - Current: Technomancer ⚡
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-3 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">Brand Connoisseur (25)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">Diagnostic Prodigy (75)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">Circuit Expert (150)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">Warranty Wizard (250)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">The Specialist (350)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50/50 rounded-lg border-l-4 border-blue-500">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600">✅</span>
                              <span className="font-medium">Technomancer (500)</span>
                            </div>
                            <p className="text-sm opacity-70 ml-6">Current Rank</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Cleaning Services */}
                      <Card className="fintech-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            🧹 Cleaning Services - "The Spotless Squad"
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">Speed Cleaner (25)</span>
                            </div>
                            <p className="text-sm opacity-70 ml-6">Need to complete 25 cleaning jobs</p>
                          </div>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">The Organizer (75)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">Chemical Connoisseur (150)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">Stain Slayer (250)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">Move-Out Magician (350)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">SPOTLESS (500)</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Personal Wellness */}
                      <Card className="fintech-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            💆 Personal Wellness - "The Knot Busters"
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-3 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">Pressure Point Master (50)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">The Stress Eraser (100)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-600">🔄</span>
                              <span className="font-medium">Mobile Miracle Worker (127/200)</span>
                            </div>
                            <Progress value={63.5} className="h-2 mt-2" />
                          </div>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">Insurance Navigator (300)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">The Recovery Coach (400)</span>
                            </div>
                          </div>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">The Knot Buster (500)</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Extended Behavioral Achievements */}
                  <Collapsible open={!collapsedSections.behavioralAchievements} onOpenChange={() => toggleSection('behavioralAchievements')}>
                    <CollapsibleTrigger asChild>
                      <Card className="fintech-card cursor-pointer hover:bg-muted/5">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-5 w-5" />
                              ⚡ Extended Behavioral Achievements
                            </div>
                            {collapsedSections.behavioralAchievements ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Community & Collaboration */}
                        <Card className="fintech-card">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Users2 className="h-5 w-5" />
                              🤝 Community & Collaboration
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="p-3 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">✅ Network Navigator</span>
                                <Badge variant="default">Complete</Badge>
                              </div>
                              <p className="text-sm opacity-70">127/100 connections</p>
                              <Progress value={100} className="h-2 mt-1" />
                            </div>
                            <div className="p-3 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">🔄 Team Player</span>
                                <Badge variant="outline">In Progress</Badge>
                              </div>
                              <p className="text-sm opacity-70">12/50 crew opportunities</p>
                              <Progress value={24} className="h-2 mt-1" />
                            </div>
                            <div className="p-3 bg-muted/20 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">🔒 Loyal</span>
                                <Badge variant="outline">Locked</Badge>
                              </div>
                              <p className="text-sm opacity-70">6 months in crew, need 1+ year</p>
                            </div>
                            <div className="p-3 bg-muted/20 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">🔒 Crew Starter</span>
                                <Badge variant="outline">Locked</Badge>
                              </div>
                              <p className="text-sm opacity-70">0/3 crews founded</p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Speed & Responsiveness */}
                        <Card className="fintech-card">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="h-5 w-5" />
                              ⚡ Speed & Responsiveness
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="p-3 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">🔄 Lightning Response</span>
                                <Badge variant="outline">In Progress</Badge>
                              </div>
                              <p className="text-sm opacity-70">4 min avg, need &lt;2 min</p>
                              <Progress value={50} className="h-2 mt-1" />
                            </div>
                            <div className="p-3 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">🔄 Same Day Savior</span>
                                <Badge variant="outline">In Progress</Badge>
                              </div>
                              <p className="text-sm opacity-70">12/50 same-day bookings</p>
                              <Progress value={24} className="h-2 mt-1" />
                            </div>
                            <div className="p-3 bg-muted/20 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">🔒 Emergency Responder</span>
                                <Badge variant="outline">Locked</Badge>
                              </div>
                              <p className="text-sm opacity-70">2/10 emergency calls</p>
                              <Progress value={20} className="h-2 mt-1" />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Commendation Champions */}
                        <Card className="fintech-card">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Star className="h-5 w-5" />
                              🗣️ Commendation Champions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="p-3 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">✅ Quality Collector</span>
                                <Badge variant="default">Complete</Badge>
                              </div>
                              <p className="text-sm opacity-70">23/100 Quality recogs</p>
                              <Progress value={23} className="h-2 mt-1" />
                            </div>
                            <div className="p-3 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">🔄 Reliability Rockstar</span>
                                <Badge variant="outline">In Progress</Badge>
                              </div>
                              <p className="text-sm opacity-70">18/100 Reliability recogs</p>
                              <Progress value={18} className="h-2 mt-1" />
                            </div>
                            <div className="p-3 bg-yellow-50/50 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">🔄 Courtesy King/Queen</span>
                                <Badge variant="outline">In Progress</Badge>
                              </div>
                              <p className="text-sm opacity-70">31/100 Courtesy recogs</p>
                              <Progress value={31} className="h-2 mt-1" />
                            </div>
                            <div className="p-3 bg-muted/20 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">🔒 The Triple Threat</span>
                                <Badge variant="outline">Locked</Badge>
                              </div>
                              <p className="text-sm opacity-70">Need 25+ of each type</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Platform Milestones */}
                  <Collapsible open={!collapsedSections.platformMilestones} onOpenChange={() => toggleSection('platformMilestones')}>
                    <CollapsibleTrigger asChild>
                      <Card className="fintech-card cursor-pointer hover:bg-muted/5">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Target className="h-5 w-5" />
                              🎯 Platform Milestones
                            </div>
                            {collapsedSections.platformMilestones ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <Card className="fintech-card">
                        <CardContent className="space-y-4 pt-6">
                          <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">First Service</span>
                            </div>
                            <p className="text-sm opacity-70 ml-6">Complete your first service booking</p>
                          </div>
                          <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">10 Jobs Completed</span>
                            </div>
                            <p className="text-sm opacity-70 ml-6">Build your foundation</p>
                          </div>
                          <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">50 Jobs Completed</span>
                            </div>
                            <p className="text-sm opacity-70 ml-6">Establishing your reputation</p>
                          </div>
                          <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="font-medium">100 Jobs Completed</span>
                            </div>
                            <p className="text-sm opacity-70 ml-6">Proven track record</p>
                          </div>
                          <div className="p-4 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">500 Jobs Mastery</span>
                            </div>
                            <p className="text-sm opacity-70 ml-6">Advanced professional status</p>
                          </div>
                          <div className="p-4 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">🔒</span>
                              <span className="font-medium">1,000 Jobs Legend</span>
                            </div>
                            <p className="text-sm opacity-70 ml-6">Elite status achievement</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 5. Display Customization */}
                  <Card className="fintech-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        🎨 Choose Your Public Display
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Current Rank Display</p>
                            <p className="text-sm opacity-70">Technomancer ⚡</p>
                          </div>
                          <Button variant="outline" size="sm">Change</Button>
                        </div>
                      </div>
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Current Recognition Display</p>
                            <p className="text-sm opacity-70">Quality Expert ⭐</p>
                          </div>
                          <Button variant="outline" size="sm">Change</Button>
                        </div>
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

        {/* Modals */}
        {/* Network Connections Modal */}
        <Dialog open={openModal === 'connections'} onOpenChange={() => setOpenModal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Network Connections (127)
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 opacity-60" />
                <Input 
                  placeholder="Search connections..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {connections.map((connection, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {connection.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{connection.name}</p>
                        <p className="text-sm opacity-70">{connection.service}</p>
                        <p className="text-xs opacity-60">Last active: {connection.lastActivity}</p>
                      </div>
                    </div>
                    <Badge variant={connection.status === 'Active' ? 'default' : 'secondary'}>
                      {connection.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Community Points Shop Modal */}
        <Dialog open={openModal === 'points'} onOpenChange={() => setOpenModal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Community Points Shop
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white text-center">
                <p className="text-3xl font-bold">2,450 Points</p>
                <p className="opacity-90">Available Balance</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shopItems.map((item, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                    <p className="text-sm opacity-70 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">{item.cost} pts</span>
                      <Button size="sm" disabled={item.cost > 2450}>
                        {item.cost > 2450 ? 'Insufficient' : 'Purchase'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Memberships Modal */}
        <Dialog open={openModal === 'memberships'} onOpenChange={() => setOpenModal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                My Memberships (3)
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {memberships.map((membership, index) => (
                <div key={index} className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{membership.name}</h3>
                      <p className="text-sm opacity-70">{membership.members} members • {membership.type}</p>
                    </div>
                    <Badge variant="default">{membership.role}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-70">Last activity: {membership.lastActivity}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Rank Progression Modal */}
        <Dialog open={openModal === 'rank'} onOpenChange={() => setOpenModal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Rank Progression System
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white">
                <p className="text-2xl font-bold">Technomancer ⚡</p>
                <p className="opacity-90">Current Overall Rank</p>
              </div>
              <div className="space-y-4">
                {rankProgress.map((category, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{category.category}</h3>
                        <p className="text-sm opacity-70">Current: {category.current}</p>
                      </div>
                      <Badge variant="outline">Next: {category.next}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress to {category.next}</span>
                        <span>{category.progress}%</span>
                      </div>
                      <Progress value={category.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CommunityDashboard;