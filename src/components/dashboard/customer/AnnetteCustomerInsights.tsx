import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, MessageCircle, TrendingUp, Heart } from 'lucide-react';

const AnnetteCustomerInsights = () => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [showJoke, setShowJoke] = useState(false);

  // Smart rotating insights based on customer data
  const insights = [
    {
      type: 'rebooking',
      icon: Heart,
      title: 'Rebooking Suggestion',
      message: "You've completed 4 jobs with Jean. Want to send him another booking? That boy's got magic hands for cleaning! ✨",
      action: 'Book Jean Again'
    },
    {
      type: 'spending',
      icon: TrendingUp,
      title: 'Spending Insight',
      message: "You've spent $940 across 3 service categories — looks like you're due for a Prestige boost! Keep it up, sugar! 💰",
      action: 'View Analytics'
    },
    {
      type: 'milestone',
      icon: Sparkles,
      title: 'Prestige Update',
      message: "One more 5-star review and you're unlocking the next title! Your reputation game is ON POINT! 🌟",
      action: 'Check Progress'
    },
    {
      type: 'tips',
      icon: MessageCircle,
      title: 'Pro Tip',
      message: "Haven't rebooked anyone yet? Honey, that's where the magic happens! Find your favorites and keep 'em close. 💅",
      action: 'View Trusted Providers'
    }
  ];

  // Rare long jokes (very low chance)
  const longJokes = [
    {
      title: 'Customer Empire Building',
      message: "You're building a hiring empire here, sugar! Should I call you HR or Your Highness? 👑 Either way, you're treating people right and that's what HOUSIE is all about!",
      punchline: "Next stop: Neighborhood Connector status! 🚀"
    },
    {
      title: 'Service Comedy Hour',
      message: "Why did the leaf blower start a service business? Because it blew up on TikTok, hired 3 squirrels, and now it's booked until fall! 🍂😂",
      punchline: "Unlike that leaf blower, YOUR bookings are actually legitimate! 🎯"
    },
    {
      title: 'Prestige Philosophy',
      message: "You know what they say about building trust? It's like making a good poutine - takes the right ingredients, perfect timing, and someone who actually knows what they're doing! 🧀",
      punchline: "And honey, you're cooking up something DELICIOUS with these connections! 🔥"
    }
  ];

  // Rotate insights every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Very rare chance (1%) to show a long joke instead
      if (Math.random() < 0.01) {
        setShowJoke(true);
        setTimeout(() => setShowJoke(false), 12000); // Show joke for 12 seconds
      } else {
        setCurrentInsight((prev) => (prev + 1) % insights.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [insights.length]);

  const currentJoke = longJokes[Math.floor(Math.random() * longJokes.length)];
  const currentInsightData = insights[currentInsight];
  
  const InsightIcon = showJoke ? Sparkles : currentInsightData.icon;

  return (
    <Card className="fintech-card border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/annette.jpg" alt="Annette" />
            <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-primary">Annette</span>
            <span className="text-muted-foreground text-sm ml-2">
              {showJoke ? '🎭 Comedy Hour' : 'Smart Insights'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="fintech-inner-box p-4 bg-primary/5">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <InsightIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">
                {showJoke ? currentJoke.title : currentInsightData.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {showJoke ? currentJoke.message : currentInsightData.message}
              </p>
              {showJoke && currentJoke.punchline && (
                <p className="text-sm text-primary font-medium mt-2">
                  {currentJoke.punchline}
                </p>
              )}
            </div>
          </div>
          
          {!showJoke && currentInsightData.action && (
            <button className="text-xs text-primary hover:text-primary/80 font-medium">
              {currentInsightData.action} →
            </button>
          )}
        </div>

        {/* Insight indicators */}
        <div className="flex justify-center gap-2">
          {insights.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentInsight && !showJoke
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          ))}
          {showJoke && (
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          )}
        </div>

        {/* Status indicator */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            {showJoke ? '🎭 Rare joke mode activated!' : 'Smart insights updating...'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnetteCustomerInsights;