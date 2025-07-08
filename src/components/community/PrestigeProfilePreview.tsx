import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Crown, 
  Star, 
  Eye, 
  EyeOff, 
  Settings, 
  Trophy,
  Award,
  Heart,
  CheckCircle,
  MessageCircle,
  X,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PrestigeProfilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrestigeProfilePreview: React.FC<PrestigeProfilePreviewProps> = ({ isOpen, onClose }) => {
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [equippedTitle, setEquippedTitle] = useState('Technomancer ⚡');
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [visibilitySettings, setVisibilitySettings] = useState({
    showTitle: true,
    showRating: true,
    showRecognition: true,
    showBadges: false
  });

  // Mock data
  const profileData = {
    currentTitle: 'Technomancer ⚡',
    availableTitles: [
      'Technomancer ⚡',
      'Quality Expert ⭐',
      'Reliable Pro 🛠️',
      'Community Favorite ❤️'
    ],
    overallRating: 4.9,
    totalReviews: 127,
    recognitionBreakdown: {
      quality: 23,
      reliability: 18,
      courtesy: 31,
      total: 72
    },
    recentReviews: [
      {
        id: 1,
        rating: 5,
        comment: "Exceptional service! Fixed my appliances perfectly and explained everything clearly.",
        customerName: "Sarah M.",
        date: "2 days ago",
        verified: true
      },
      {
        id: 2,
        rating: 5,
        comment: "Very professional and reliable. Highly recommend for tech repairs!",
        customerName: "Mike T.",
        date: "1 week ago",
        verified: true
      },
      {
        id: 3,
        rating: 4,
        comment: "Great work on my laptop repair. Fast and efficient service.",
        customerName: "Lisa K.",
        date: "2 weeks ago",
        verified: true
      }
    ]
  };

  const handleTitleChange = (newTitle: string) => {
    setEquippedTitle(newTitle);
    toast({
      title: "Title Updated",
      description: `Your equipped title has been changed to "${newTitle}"`,
    });
  };

  const handleProfileVisibilityToggle = (checked: boolean) => {
    setIsPublicProfile(checked);
    toast({
      title: checked ? "Profile Made Public" : "Profile Made Private",
      description: checked 
        ? "Your prestige profile is now visible to others" 
        : "Your prestige profile is now private",
    });
  };

  const handleVisibilitySettingChange = (setting: string, checked: boolean) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [setting]: checked
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Prestige Profile Preview
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="space-y-6 p-1">
              {/* Profile Status and Controls */}
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  {isPublicProfile ? (
                    <Eye className="h-5 w-5 text-green-600" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">
                      Profile Status: {isPublicProfile ? 'Public' : 'Private'}
                    </p>
                    <p className="text-sm opacity-70">
                      {isPublicProfile 
                        ? 'Others can see your prestige profile' 
                        : 'Your prestige profile is hidden from others'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={isPublicProfile}
                    onCheckedChange={handleProfileVisibilityToggle}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCustomizeModal(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize Display
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Title Section */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Equipped Title
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-gray-900">{equippedTitle}</p>
                          <p className="text-sm text-gray-600">Currently Equipped</p>
                        </div>
                        <Crown className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Available Titles:</p>
                      <div className="space-y-2">
                        {profileData.availableTitles.map((title) => (
                          <div 
                            key={title}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                              title === equippedTitle 
                                ? 'bg-yellow-100 border border-yellow-300' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            onClick={() => handleTitleChange(title)}
                          >
                            <span className={`text-sm ${title === equippedTitle ? 'font-medium' : ''}`}>
                              {title}
                            </span>
                            {title === equippedTitle && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Star Rating Section */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Overall Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold">{profileData.overallRating}</span>
                        <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Based on {profileData.totalReviews} verified reviews
                      </p>
                      
                      <div className="flex items-center justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.floor(profileData.overallRating) 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setShowReviewsModal(true)}
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        View All Reviews
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recognition Breakdown */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Recognition Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-lg text-center">
                      <Trophy className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{profileData.recognitionBreakdown.quality}</p>
                      <p className="text-sm text-gray-600">Quality</p>
                    </div>
                    <div className="p-4 bg-green-50/50 rounded-lg text-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{profileData.recognitionBreakdown.reliability}</p>
                      <p className="text-sm text-gray-600">Reliability</p>
                    </div>
                    <div className="p-4 bg-purple-50/50 rounded-lg text-center">
                      <Heart className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">{profileData.recognitionBreakdown.courtesy}</p>
                      <p className="text-sm text-gray-600">Courtesy</p>
                    </div>
                    <div className="p-4 bg-yellow-50/50 rounded-lg text-center">
                      <Crown className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-600">{profileData.recognitionBreakdown.total}</p>
                      <p className="text-sm text-gray-600">Total Points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview of Recent Reviews */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Recent Reviews
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowReviewsModal(true)}
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData.recentReviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= review.rating 
                                      ? 'text-yellow-500 fill-yellow-500' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">"{review.comment}"</p>
                        <p className="text-xs text-gray-500">- {review.customerName}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Reviews Modal */}
      <Dialog open={showReviewsModal} onOpenChange={setShowReviewsModal}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              All Reviews ({profileData.totalReviews})
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
              {profileData.recentReviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 mb-3">"{review.comment}"</p>
                  <p className="text-sm text-gray-500">- {review.customerName}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Customize Display Modal */}
      <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Customize Public Display
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose what information is visible in your public profile:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Equipped Title</p>
                  <p className="text-xs text-gray-500">Display your current title</p>
                </div>
                <Switch
                  checked={visibilitySettings.showTitle}
                  onCheckedChange={(checked) => handleVisibilitySettingChange('showTitle', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Star Rating</p>
                  <p className="text-xs text-gray-500">Display overall rating and review count</p>
                </div>
                <Switch
                  checked={visibilitySettings.showRating}
                  onCheckedChange={(checked) => handleVisibilitySettingChange('showRating', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Recognition Points</p>
                  <p className="text-xs text-gray-500">Display recognition breakdown</p>
                </div>
                <Switch
                  checked={visibilitySettings.showRecognition}
                  onCheckedChange={(checked) => handleVisibilitySettingChange('showRecognition', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Badges</p>
                  <p className="text-xs text-gray-500">Display earned achievement badges</p>
                </div>
                <Switch
                  checked={visibilitySettings.showBadges}
                  onCheckedChange={(checked) => handleVisibilitySettingChange('showBadges', checked)}
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCustomizeModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowCustomizeModal(false);
                  toast({
                    title: "Display Settings Updated",
                    description: "Your public profile display preferences have been saved.",
                  });
                }}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrestigeProfilePreview;