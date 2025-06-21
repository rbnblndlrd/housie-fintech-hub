
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, AlertTriangle } from 'lucide-react';

const EmergencyNotificationDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all_users');
  const [priority, setPriority] = useState('high');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendNotification = async () => {
    if (!user || !title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // Insert the emergency notification
      const { error } = await supabase
        .from('emergency_notifications')
        .insert({
          admin_id: user.id,
          notification_type: 'emergency_alert',
          title: title.trim(),
          message: message.trim(),
          target_audience: targetAudience,
          priority,
          status: 'pending'
        });

      if (error) throw error;

      // Log the action
      await supabase.from('emergency_actions_log').insert({
        admin_id: user.id,
        action_type: 'send_emergency_notification',
        action_details: {
          title,
          message,
          target_audience: targetAudience,
          priority
        }
      });

      toast({
        title: "Emergency Notification Sent",
        description: `Notification has been sent to ${targetAudience.replace('_', ' ')}`,
      });

      // Reset form
      setTitle('');
      setMessage('');
      setTargetAudience('all_users');
      setPriority('high');
      setOpen(false);

    } catch (error: any) {
      console.error('Error sending emergency notification:', error);
      toast({
        title: "Error",
        description: "Failed to send emergency notification",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Megaphone className="h-4 w-4" />
          Send Emergency Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Emergency Notification
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Alert Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Emergency System Alert"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the emergency situation and any actions users should take..."
              rows={4}
              maxLength={500}
            />
          </div>

          <div>
            <Label htmlFor="audience">Target Audience</Label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_users">All Users</SelectItem>
                <SelectItem value="providers_only">Providers Only</SelectItem>
                <SelectItem value="customers_only">Customers Only</SelectItem>
                <SelectItem value="admins_only">Admins Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              disabled={sending || !title.trim() || !message.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {sending ? 'Sending...' : 'Send Alert'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyNotificationDialog;
