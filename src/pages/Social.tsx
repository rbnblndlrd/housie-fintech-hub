
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Users, 
  MapPin, 
  Star,
  Calendar,
  Camera,
  Plus
} from 'lucide-react';

const Social = () => {
  const posts = [
    {
      id: 1,
      user: {
        name: "Marie Dubois",
        avatar: "",
        role: "Professional Cleaner",
        location: "Montreal, QC"
      },
      content: "Just finished a deep clean for a lovely family in Westmount! Their home is sparkling ✨",
      image: "",
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: "2 hours ago",
      tags: ["cleaning", "residential"]
    },
    {
      id: 2,
      user: {
        name: "Jean Martin",
        avatar: "",
        role: "Handyman",
        location: "Laval, QC"
      },
      content: "Completed a kitchen renovation today. The before and after is incredible! 🔨",
      image: "",
      likes: 42,
      comments: 15,
      shares: 7,
      timestamp: "4 hours ago",
      tags: ["renovation", "kitchen"]
    },
    {
      id: 3,
      user: {
        name: "Sophie Chen",
        avatar: "",
        role: "Electrician",
        location: "Toronto, ON"
      },
      content: "Safety first! Just installed new electrical panels for a growing family. Always happy to help keep homes safe! ⚡",
      image: "",
      likes: 31,
      comments: 12,
      shares: 5,
      timestamp: "6 hours ago",
      tags: ["electrical", "safety"]
    }
  ];

  const trendingTopics = [
    { tag: "cleaning", count: 156 },
    { tag: "renovation", count: 89 },
    { tag: "plumbing", count: 67 },
    { tag: "electrical", count: 54 },
    { tag: "gardening", count: 43 }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                Community Hub
              </h1>
              <p className="text-white/90 text-shadow">
                Connect with other service providers and share your experiences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-3 space-y-6">
                {/* Create Post */}
                <Card className="fintech-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback className="bg-blue-500 text-white">U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 fintech-inner-box px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
                        What's happening in your work today?
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="fintech-inner-button">
                          <Camera className="h-4 w-4 mr-2" />
                          Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="fintech-inner-button">
                          <MapPin className="h-4 w-4 mr-2" />
                          Location
                        </Button>
                      </div>
                      <Button className="fintech-button-primary">
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                {posts.map((post) => (
                  <Card key={post.id} className="fintech-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {post.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{post.user.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {post.user.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm opacity-60">
                            <MapPin className="h-3 w-3" />
                            {post.user.location}
                            <span>•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <p className="mb-4">{post.content}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-blue-500/20 text-blue-800">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-6">
                          <Button variant="ghost" size="sm" className="fintech-inner-button hover:text-red-500">
                            <Heart className="h-4 w-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="fintech-inner-button hover:text-blue-500">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="fintech-inner-button hover:text-green-500">
                            <Share2 className="h-4 w-4 mr-2" />
                            {post.shares}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Trending Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trendingTopics.map((topic) => (
                      <div key={topic.tag} className="flex items-center justify-between">
                        <span className="text-blue-600 cursor-pointer hover:text-blue-800">
                          #{topic.tag}
                        </span>
                        <span className="text-sm opacity-60">{topic.count} posts</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Active Providers</span>
                      </div>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>Jobs Completed</span>
                      </div>
                      <span className="font-semibold">8,392</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>This Month</span>
                      </div>
                      <span className="font-semibold">456</span>
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

export default Social;
