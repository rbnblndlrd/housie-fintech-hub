import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, Radio, Settings } from 'lucide-react';
import { CanonEventCard } from './CanonEventCard';
import { CanonStampInspector } from './CanonStampInspector';
import { CanonSubscriptionsSettings } from './CanonSubscriptionsSettings';
import { useCanonEvents, CanonEvent } from '@/hooks/useCanonEvents';
import { useToast } from '@/hooks/use-toast';

export const BroadcastDashboard: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CanonEvent | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  
  const { events, loading, error, updateEventScope } = useCanonEvents(filter);
  const { toast } = useToast();

  const handleInspectEvent = (event: CanonEvent) => {
    setSelectedEvent(event);
    setInspectorOpen(true);
  };

  const handleShareEvent = (event: CanonEvent) => {
    navigator.clipboard.writeText(`Check out this Canon event: ${event.title}`);
    toast({
      title: "Shared!",
      description: "Event details copied to clipboard.",
    });
  };

  const handleUpdateScope = async (eventId: string, newScope: string) => {
    try {
      await updateEventScope(eventId, newScope);
      toast({
        title: "Updated!",
        description: "Event visibility changed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event visibility.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading broadcast: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-primary" />
              <CardTitle>The Broadcast</CardTitle>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Radio className="w-4 h-4" />
            Canon Feed
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Network Sync
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="my-stamps">My Stamps</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Events Feed */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-20 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Canon Events Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start achieving milestones to broadcast your Canon events!
                  </p>
                  <Button>Create First Event</Button>
                </CardContent>
              </Card>
            ) : (
              events.map((event) => (
                <CanonEventCard
                  key={event.id}
                  event={event}
                  onInspect={handleInspectEvent}
                  onShare={handleShareEvent}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <CanonSubscriptionsSettings />
        </TabsContent>
      </Tabs>

      {/* Inspector Modal */}
      <CanonStampInspector
        event={selectedEvent}
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        onUpdateScope={handleUpdateScope}
      />
    </div>
  );
};