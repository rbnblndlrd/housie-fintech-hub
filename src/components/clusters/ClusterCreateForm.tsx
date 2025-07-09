import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Users, MapPin, Clock, Target, Shield, Share2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TIME_BLOCKS = [
  { id: 'morning', label: 'Morning (8AM - 12PM)', value: '08:00-12:00' },
  { id: 'afternoon', label: 'Afternoon (12PM - 5PM)', value: '12:00-17:00' },
  { id: 'evening', label: 'Evening (5PM - 8PM)', value: '17:00-20:00' },
  { id: 'weekend_morning', label: 'Weekend Morning (9AM - 1PM)', value: '09:00-13:00' },
  { id: 'weekend_afternoon', label: 'Weekend Afternoon (1PM - 6PM)', value: '13:00-18:00' }
];

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

const SERVICE_TYPES = [
  'Cleaning',
  'Lawn Care',
  'Snow Removal',
  'Handyman',
  'Moving',
  'Painting',
  'Plumbing',
  'Electrical'
];

const ClusterCreateForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: '',
    location: '',
    neighborhood: '',
    days_available: [] as string[],
    time_blocks: [] as string[],
    min_participants: 3,
    max_participants: 10,
    target_participants: 5,
    requires_verification: true
  });

  const handleDayToggle = (dayId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      days_available: checked 
        ? [...prev.days_available, dayId]
        : prev.days_available.filter(d => d !== dayId)
    }));
  };

  const handleTimeBlockToggle = (blockId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      time_blocks: checked 
        ? [...prev.time_blocks, blockId]
        : prev.time_blocks.filter(b => b !== blockId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a cluster.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Generate share code
      const shareCode = Math.random().toString(36).substring(2, 15);
      
      // Create cluster
      const { data: cluster, error } = await supabase
        .from('clusters' as any)
        .insert({
          organizer_id: user.id,
          title: formData.title,
          description: formData.description,
          service_type: formData.service_type,
          location: formData.location,
          neighborhood: formData.neighborhood,
          days_available: formData.days_available,
          min_participants: formData.min_participants,
          max_participants: formData.max_participants,
          target_participants: formData.target_participants,
          requires_verification: formData.requires_verification,
          share_code: shareCode
        })
        .select()
        .single();

      if (error) throw error;

      // Create time blocks
      if (formData.time_blocks.length > 0) {
        const timeBlocksData = formData.time_blocks.map(blockId => {
          const block = TIME_BLOCKS.find(b => b.id === blockId);
          return {
            cluster_id: cluster.id,
            block_name: block?.label || blockId,
            start_time: block?.value.split('-')[0] + ':00' || '09:00:00',
            end_time: block?.value.split('-')[1] + ':00' || '17:00:00'
          };
        });

        const { error: timeBlockError } = await supabase
          .from('cluster_time_blocks' as any)
          .insert(timeBlocksData);

        if (timeBlockError) throw timeBlockError;
      }

      toast({
        title: "Cluster Created!",
        description: "Your cluster has been created and is ready for participants."
      });

      navigate(`/clusters/${cluster.id}`);
    } catch (error) {
      console.error('Error creating cluster:', error);
      toast({
        title: "Error",
        description: "Failed to create cluster. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Create New Cluster
        </CardTitle>
        <p className="text-muted-foreground">
          Coordinate bulk services with your neighbors while maintaining privacy
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Cluster Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Apartment Building Cleaning"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type *</Label>
              <Select 
                value={formData.service_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map(service => (
                    <SelectItem key={service} value={service.toLowerCase()}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you're looking to coordinate..."
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location/Address *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Building address or general area"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                placeholder="e.g., Plateau, Downtown"
              />
            </div>
          </div>

          {/* Days Available */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Available Days
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DAYS_OF_WEEK.map(day => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.id}
                    checked={formData.days_available.includes(day.id)}
                    onCheckedChange={(checked) => handleDayToggle(day.id, checked as boolean)}
                  />
                  <Label htmlFor={day.id} className="text-sm font-normal">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Time Blocks */}
          <div className="space-y-4">
            <Label>Preferred Time Blocks</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TIME_BLOCKS.map(block => (
                <div key={block.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={block.id}
                    checked={formData.time_blocks.includes(block.id)}
                    onCheckedChange={(checked) => handleTimeBlockToggle(block.id, checked as boolean)}
                  />
                  <Label htmlFor={block.id} className="text-sm font-normal">
                    {block.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Participant Settings */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Participant Settings
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_participants">Minimum</Label>
                <Input
                  id="min_participants"
                  type="number"
                  min="2"
                  max="20"
                  value={formData.min_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_participants: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_participants">Target</Label>
                <Input
                  id="target_participants"
                  type="number"
                  min="2"
                  max="20"
                  value={formData.target_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_participants: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_participants">Maximum</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="2"
                  max="20"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Verification */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires_verification"
                checked={formData.requires_verification}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_verification: checked as boolean }))}
              />
              <Label htmlFor="requires_verification" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Require participant verification (Recommended)
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Verified participants have completed payment method setup or previous HOUSIE jobs
            </p>
          </div>

          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Create Cluster
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClusterCreateForm;