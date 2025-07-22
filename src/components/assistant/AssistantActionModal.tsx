import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActionDetails {
  title: string;
  description: string;
  eli5: string;
  results?: string[];
  icon: string;
}

interface AssistantActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: ActionDetails | null;
}

const actionDetails: Record<string, ActionDetails> = {
  gps: {
    title: "GPS Navigation",
    description: "Opening GPS navigation system",
    eli5: "Imagine you're going on a road trip and need directions. GPS is like having a super smart friend who knows every street and can tell you the fastest way to get anywhere!",
    results: ["GPS system activated", "Current location locked", "Ready for navigation"],
    icon: "🗺️"
  },
  optimize: {
    title: "Route Optimization",
    description: "Calculating optimal route sequence",
    eli5: "Think of it like organizing your errands - instead of randomly driving around, we figure out the smartest order to visit all your stops so you save time and gas!",
    results: ["3 stops analyzed", "ETA: 5.5 hours", "15% time savings", "Optimal sequence calculated"],
    icon: "🎯"
  },
  bookings: {
    title: "Booking Calendar",
    description: "Accessing your booking schedule",
    eli5: "Like opening your personal appointment book that shows all your scheduled jobs and helps you manage your time like a pro!",
    results: ["Calendar loaded", "3 active bookings", "2 pending confirmations"],
    icon: "📅"
  },
  parse: {
    title: "Ticket Parser",
    description: "Analyzing job ticket details",
    eli5: "Imagine reading a messy note and turning it into a clear, organized to-do list - that's what ticket parsing does with job requests!",
    results: ["Ticket analyzed", "Key details extracted", "Priority level assigned"],
    icon: "🔍"
  },
  prestige: {
    title: "Prestige Check",
    description: "Reviewing your achievement status",
    eli5: "Like checking your video game achievements or merit badges - we look at all the cool stuff you've accomplished and see what you've unlocked!",
    results: ["Current rank: Technomancer", "12 achievements unlocked", "Next milestone: 3 jobs away"],
    icon: "⭐"
  },
  home: {
    title: "Return to Dashboard",
    description: "Navigating back to main dashboard",
    eli5: "Like going back to your home base or headquarters where you can see everything at a glance!",
    results: ["Dashboard loaded", "All systems operational"],
    icon: "🏠"
  }
};

export const AssistantActionModal: React.FC<AssistantActionModalProps> = ({
  isOpen,
  onClose,
  action
}) => {
  if (!action) return null;

  const details = actionDetails[action.title.toLowerCase()] || {
    title: action.title,
    description: action.description,
    eli5: "This action helps you get things done more efficiently!",
    results: ["Action completed successfully"],
    icon: "⚡"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{details.icon}</span>
            {details.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-medium mb-2">What happened?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {details.description}
              </p>
              
              <h4 className="font-medium mb-2">ELI5 (Explain Like I'm 5)</h4>
              <p className="text-sm text-muted-foreground">
                {details.eli5}
              </p>
            </CardContent>
          </Card>

          {details.results && (
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2">Results</h4>
                <div className="space-y-2">
                  {details.results.map((result, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{result}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={onClose} className="w-full">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};